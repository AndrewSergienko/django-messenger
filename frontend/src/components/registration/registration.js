import React, { Component } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

import { Form, InfoMessage, Input, Submit, ErrorLabel, RedirectSpan } from '../formInputs/formInputs';

export default class Registration extends Component {
   state = {
      isCreated: false,
      isVerified: false,

      email: "",
      token: "",
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      confirm_password: "",

      emailAndCodeLabel: "",
      first_nameLabel: "",
      usernameLabel: "",
      passwordLabel: "",
      confirm_passwordLabel: "",

      buttonText: "Continue"
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const name = event.target.name,
            value = event.target.value;

      this.setState({ 
         [name]: value,

         emailAndCodeLabel: "",
         first_nameLabel: "",
         usernameLabel: "",
         passwordLabel: "",
         confirm_passwordLabel: ""
      });
   }

   checkValidation = (errorsObject) => {
      for (const [field, reason] of Object.entries(errorsObject)) {
         switch (field) {
            case 'email':
               switch (reason[0]) {
                  case 'user exist':
                     this.setState({emailAndCodeLabel: 'User with this email already exists'});
                     break;
                  case 'not valid':
                     this.setState({emailAndCodeLabel: 'Email is not valid'});
                     break;
                  default:
                     break;
               }
               break;
            case 'password':
               switch (reason[0]) {
                  case 'short':
                     this.setState({passwordLabel: 'Password must be more than 8 characters long'});
                     break;
                  case 'common':
                     this.setState({passwordLabel: 'Password must be alphanumeric and contain a capital letter'});
                     break;
                  case 'onlynums':
                     this.setState({passwordLabel: 'Password must contain not only numbers'});
                     break;
                  default:
                     break;
               }
               break;
            case 'username':
               switch (reason[0]) {
                  case 'short':
                     this.setState({usernameLabel: 'Username must be more than 4 characters long'});
                     break;
                  case 'user exist':
                     this.setState({usernameLabel: 'User with this username already exists'});
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
               emailAndCodeLabel: '',
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
               emailAndCodeLabel: 'Incorrect verification code.',
               buttonText: 'Continue'
            });
         } else {
            this.setState({
               isVerified: true,
               isCreated: false,
               emailAndCodeLabel: '',
               buttonText: 'Registration'
            });
         }
      });
   }

   createUser = async (event) => {
      event.preventDefault();
      const { first_name, last_name, username, email, password, confirm_password } = this.state;
      const { registration, redirect } = this.props;
      
      if (password !== confirm_password) {
         this.setState({
            confirm_passwordLabel: 'Passwords do not match',
            buttonText: 'Continue'
         });
      } else {
         this.setState({buttonText: <PulseLoader color={'#FFF'} size={10}/>});
         await registration(email, username, password, first_name, last_name).then(res => {
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
                  buttonText: 'Continue'
               });

               redirect();
            }
         });
      }
   }

   render() {
      const { 
               isCreated, 
               isVerified, 
               email, 
               token, 
               first_name, 
               last_name, 
               username, 
               password, 
               confirm_password, 
               emailAndCodeLabel, 
               first_nameLabel, 
               usernameLabel, 
               passwordLabel, 
               confirm_passwordLabel, 
               buttonText 
            } = this.state;
            
      let submitFunc = this.createToken;
      let content = 
         <>
            <Input type="email" className="form-control" id="email-input" placeholder="Email" name='email' value={email} onChange={this.changeInput} required />
            <ErrorLabel>{emailAndCodeLabel}</ErrorLabel>
         </>
      if (isCreated) {
         submitFunc = this.verifyToken;
         content = 
            <>
               <Input type="text" className="form-control" id="token-input" placeholder="Confirmation code" name='token' value={token} onChange={this.changeInput} required/>
               <ErrorLabel>{emailAndCodeLabel}</ErrorLabel>
            </>
      } else if (isVerified) {
         submitFunc = this.createUser;
         content = 
            <>
               <Input type="text" className="form-control" id="f-name-input" placeholder="First name" name='first_name' value={first_name} onChange={this.changeInput} required />
               <ErrorLabel>{first_nameLabel}</ErrorLabel>
               <Input type="text" className="form-control" id="l-name-input" placeholder="Last name" name='last_name' value={last_name} onChange={this.changeInput} />
               <ErrorLabel></ErrorLabel>
               <Input type="text" className="form-control" id="username-input" placeholder="Username" name='username' value={username} onChange={this.changeInput} required />
               <ErrorLabel>{usernameLabel}</ErrorLabel>
               <Input type="password" className="form-control" id="password-input" placeholder="Password" name='password' value={password} onChange={this.changeInput} required />
               <ErrorLabel>{passwordLabel}</ErrorLabel>
               <Input type="password" className="form-control" id="c-password-input" placeholder="Confirm password" name='confirm_password' value={confirm_password} onChange={this.changeInput} required />
               <ErrorLabel>{confirm_passwordLabel}</ErrorLabel>
            </>
      }

      return (
         <Form
            className='registration-form d-flex'
            onSubmit={submitFunc}
            autoComplete='off'>
            <h2>Sign up with your email</h2>
            <InfoMessage className='info-message'>Already have an account? 
               <RedirectSpan onClick={this.props.redirect}> Sign in</RedirectSpan>
            </InfoMessage>
            { content }
            <Submit 
               type="submit" 
               className="btn btn-primary">{buttonText}</Submit>
         </Form>
      )
   }
}