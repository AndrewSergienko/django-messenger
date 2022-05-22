import React, { Component } from 'react';

import { Form, InfoMessage, Input, Submit, Label, RedirectSpan } from '../formInputs';

export default class Registration extends Component {
   state = {
      first_name: "",
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      labelMessage: "",
      labelColor: ""
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
   submitForm = async (event) => {
      event.preventDefault();
      const { first_name, username, email, password, confirm_password } = this.state;
      const { registration, redirect } = this.props;
      
      if (password !== confirm_password) {
         this.setState({
            labelMessage: 'Passwords do not match',
            labelColor: 'red'
         });
      } else {
         await registration(email, username, password, first_name).then(res => {
            if (res) {
               this.checkValidation(res);
            } else {
               this.setState({
                  first_name: "",
                  username: "",
                  password: "",
                  confirm_password: "",
                  email: "",
                  labelMessage: 'You have successfully registered. In 5 seconds you will be redirected to the login page',
                  labelColor: 'green'
               });

               setTimeout(redirect, 5000);
            }
         });
      }
   }

   render() {
      const { first_name, username, email, password, confirm_password, labelMessage, labelColor } = this.state;

      return (
         <Form 
            height={620}
            className='registration-form d-flex align-items-center'
            onSubmit={this.submitForm}>
            <h2>Registration</h2>
            <InfoMessage className='info-message'>Already a member? You can log in 
               <RedirectSpan onClick={this.props.redirect}> here</RedirectSpan>
            </InfoMessage>
            <Input 
               type="text" 
               className={`form-control`}
               id="f-name-input" 
               placeholder="First name"
               name='first_name'
               value={first_name}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="text" 
               className={`form-control`}
               id="username-input" 
               placeholder="Username"
               name='username'
               value={username}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="email" 
               className={`form-control`}
               id="email-input" 
               placeholder="Email"
               name='email'
               value={email}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="password" 
               className={`form-control`}
               id="password-input" 
               placeholder="Password"
               name='password'
               value={password}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="password" 
               className={`form-control`}
               id="c-password-input" 
               placeholder="Confirm password"
               name='confirm_password'
               value={confirm_password}
               onChange={this.changeInput}
               required
            />
            <Submit 
               type="submit" 
               className="btn btn-primary">Registration</Submit>
            <Label color={labelColor}>{labelMessage}</Label>
         </Form>
      )
   }
}