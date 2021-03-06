import React, { Component } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

import { Form, InfoMessage, Input, Submit, ErrorLabel, RedirectSpan } from '../formInputs/formInputs'

export default class Login extends Component {
   state = {
      email: "",
      password: "",
      EmailErrorLabel: "",
      PasswordErrorLabel: "",
      
      buttonText: "Login"
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const target = event.target;
      
      if (target.id === "email-input") {
         this.setState({
            email: target.value,
            EmailErrorLabel: ""
         });
      } else if (target.id === "password-input") {
         this.setState({
            password: target.value,
            PasswordErrorLabel: ""
         });
      }
   }

   checkValidation = (errorsObject) => {
      for (const [field, reason] of Object.entries(errorsObject)) {
         switch (field) {
            case 'email':
               switch (reason[0]) {
                  case 'not exist':
                     this.setState({EmailErrorLabel: 'User with this email not exists'});
                     continue;
                  default:
                     continue;
               }
            case 'password':
               switch (reason[0]) {
                  case 'not correct':
                     this.setState({PasswordErrorLabel: 'Wrong password'});
                     continue;
                  default:
                     continue;
               }
            default:
               continue;
         }
      }
   }

   checkValidation = (errorsObject) => {
      for (const [field, reason] of Object.entries(errorsObject)) {
         switch (field) {
            case 'email':
               this.setState({labelColor: 'red'});
               switch (reason[0]) {
                  case 'not exist':
                     this.setState({labelMessage: 'User with this email not exists'});
                     break;
                  default:
                     break;
               }
               break;
            case 'password':
               this.setState({labelColor: 'red'});
               switch (reason[0]) {
                  case 'not correct':
                     this.setState({labelMessage: 'Wrong password. Try entering the password again and try logging in again'});
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
      const { email, password } = this.state;
      const { login } = this.props;

      this.setState({buttonText: <PulseLoader color={'#FFF'} size={10}/>});
      await login(email, password).then(res => {
         if (res) {
            this.checkValidation(res);
            this.setState({buttonText: 'Login'});
         } else {
            this.setState({
               email: "",
               password: "",
               EmailErrorLabel: "",
               PasswordErrorLabel: "",
               buttonText: 'Login'
            });
         }
      });
   }

   render() {
      const { redirect } = this.props,
            { EmailErrorLabel, PasswordErrorLabel, buttonText } = this.state;

      return (
         <Form
            className='d-flex'
            onSubmit={this.submitForm}>
            <h2>Sign in with your email</h2>
            <InfoMessage>Don't have an account?
               <RedirectSpan onClick={redirect}> Sign up</RedirectSpan>
            </InfoMessage>
            <Input 
               type="email" 
               className="form-control" 
               id="email-input" 
               placeholder="Email address" 
               onChange={this.changeInput}
               required
            />
            <ErrorLabel>{EmailErrorLabel}</ErrorLabel>
            <Input 
               type="password" 
               className="form-control" 
               id="password-input" 
               placeholder="Password" 
               onChange={this.changeInput}
               required
            />
            <ErrorLabel>{PasswordErrorLabel}</ErrorLabel>
            <Submit 
               type="submit" 
               className="btn btn-primary">{buttonText}</Submit>
         </Form>
      )
   }
}