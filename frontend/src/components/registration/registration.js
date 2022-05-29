import React, { Component } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

import { Form, InfoMessage, Input, Submit, ErrorLabel, RedirectSpan } from '../formInputs/formInputs';

export default class Registration extends Component {
   state = {
      formHeight: 420,
      isCreated: false,
      isVerified: false,
      email: "",
      token: "",
      first_name: "",
      username: "",
      password: "",
      confirm_password: "",
      labelMessage: "",
      labelColor: "",
      buttonText: "Continue"
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const name = event.target.name,
            value = event.target.value;

      this.setState({ [name]: value });
   }

   checkValidation = (errorsObject) => {
      for (const [field, reason] of Object.entries(errorsObject)) {
         switch (field) {
            case 'email':
               this.setState({labelColor: 'red'});
               switch (reason[0]) {
                  case 'user exist':
                     this.setState({labelMessage: 'User with this email already exists'});
                     break;
                  case 'not valid':
                     this.setState({labelMessage: 'Email is not valid'});
                     break;
                  default:
                     break;
               }
               break;
            case 'password':
               this.setState({labelColor: 'red'});
               switch (reason[0]) {
                  case 'short':
                     this.setState({labelMessage: 'Password must be more than 8 characters long'});
                     break;
                  case 'common':
                     this.setState({labelMessage: 'Password must be alphanumeric and contain a capital letter'});
                     break;
                  case 'onlynums':
                     this.setState({labelMessage: 'Password must contain not only numbers'});
                     break;
                  default:
                     break;
               }
               break;
            case 'username':
               this.setState({labelColor: 'red'});
               switch (reason[0]) {
                  case 'short':
                     this.setState({labelMessage: 'Username must be more than 4 characters long'});
                     break;
                  case 'user exist':
                     this.setState({labelMessage: 'User with this username already exists'});
                     break;
                  default:
                     break;
               }
               break;
            default:
               break;
         }
      }
   }

   // When form is submit
   createToken = async (event) => {
      event.preventDefault();
      const { email } = this.state;
      const { createTokenForEmail } = this.props;
      
      this.setState({buttonText: <PulseLoader color={'#FFF'} size={10}/>})

      await createTokenForEmail(email).then(res => {
         if (res) {
            this.checkValidation(res);
            this.setState({buttonText: 'Continue'});
         } else {
            this.setState({
               isCreated: true,
               labelMessage: 'To confirm this, a notification was sent to your email with the verification code. Enter it in the corresponding field to continue registration.',
               labelColor: 'green',
               buttonText: 'Continue'
            });
         }
      });
   }

   verifyToken = async (event) => {
      event.preventDefault();
      const { email, token } = this.state;
      const { verifyTokenForEmail } = this.props;
         
      this.setState({buttonText: <PulseLoader color={'#FFF'} size={10}/>})

      await verifyTokenForEmail(email, token).then(res => {
         if (res && !res.ok) {
            this.setState({
               labelMessage: 'Incorrect verification code.',
               labelColor: 'red',
               buttonText: 'Continue'
            });
         } else {
            this.setState({
               formHeight: 550,
               isVerified: true,
               isCreated: false,
               labelMessage: 'Your mail is successfully confirmed.',
               labelColor: 'green',
               buttonText: 'Registration'
            });
         }
      });
   }

   createUser = async (event) => {
      event.preventDefault();
      const { first_name, username, email, password, confirm_password } = this.state;
      const { registration, redirect } = this.props;
      
      if (password !== confirm_password) {
         this.setState({
            labelMessage: 'Passwords do not match',
            labelColor: 'red',
            buttonText: 'Continue'
         });
      } else {
         this.setState({buttonText: <PulseLoader color={'#FFF'} size={10}/>});
         await registration(email, username, password, first_name).then(res => {
            if (res) {
               this.checkValidation(res);
               this.setState({buttonText: 'Continue'});
            } else {
               this.setState({
                  email: "",
                  token: "",
                  first_name: "",
                  username: "",
                  password: "",
                  confirm_password: "",
                  labelMessage: 'You have successfully registered. In 5 seconds you will be redirected to the login page',
                  labelColor: 'green',
                  buttonText: 'Continue'
               });

               setTimeout(redirect, 5000);
            }
         });
      }
   }

   render() {
      const { formHeight, isCreated, isVerified, email, token, first_name, username, password, confirm_password, labelMessage, labelColor, buttonText } = this.state;
      let submitFunc = this.createToken;
      let content = <Input type="email" className="form-control" id="email-input" placeholder="Email" name='email' value={email} onChange={this.changeInput} required />;

      if (isCreated) {
         submitFunc = this.verifyToken;
         content = <Input type="text" className="form-control" id="token-input" placeholder="Confirmation code" name='token' value={token} onChange={this.changeInput} required/>
      } else if (isVerified) {
         submitFunc = this.createUser;
         content = 
            <>
               <Input type="text" className="form-control" id="f-name-input" placeholder="First name" name='first_name' value={first_name} onChange={this.changeInput} required />
               <Input type="text" className="form-control" id="username-input" placeholder="Username" name='username' value={username} onChange={this.changeInput} required />
               <Input type="password" className="form-control" id="password-input" placeholder="Password" name='password' value={password} onChange={this.changeInput} required />
               <Input type="password" className="form-control" id="c-password-input" placeholder="Confirm password" name='confirm_password' value={confirm_password} onChange={this.changeInput} required />
            </>
      }

      return (
         <Form 
            height={formHeight}
            className='registration-form d-flex'
            onSubmit={submitFunc}>
            <h2>Sign up with your email</h2>
            <InfoMessage className='info-message'>Already have an account? 
               <RedirectSpan onClick={this.props.redirect}> Sign in</RedirectSpan>
            </InfoMessage>
            { content }
            <Submit 
               type="submit" 
               className="btn btn-primary">{buttonText}</Submit>
            <ErrorLabel color={labelColor}>{labelMessage}</ErrorLabel>
         </Form>
      )
   }
}