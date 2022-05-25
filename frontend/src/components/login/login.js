import React, { Component } from 'react';

import { Form, InfoMessage, Input, Submit, Label, RedirectSpan } from '../formInputs/formInputs'

export default class Login extends Component {
   state = {
      email: "",
      password: "",
      labelMessage: "",
      labelColor: ""
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const target = event.target;
      
      if (target.id === "email-input") {
         this.setState({email: target.value});
      } else if (target.id === "password-input") {
         this.setState({password: target.value});
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

      await login(email, password).then(res => {
         if (res) {
            this.checkValidation(res);
         } else {
            this.setState({
               email: "",
               password: "",
               labelMessage: 'You have successfully login',
               labelColor: 'green'
            });
         }
      });
   }

   render() {
      const { redirect } = this.props,
            { labelColor, labelMessage } = this.state;

      return (
         <Form height={500}
            className='d-flex align-items-center'
            onSubmit={this.submitForm}>
            <h2>Login</h2>
            <InfoMessage>Not a member? You can register 
               <RedirectSpan onClick={redirect}> here</RedirectSpan>
            </InfoMessage>
            <div className="form-group">
               <label htmlFor="email-input">Email</label>
               <Input 
                  type="email" 
                  className="form-control" 
                  id="email-input" 
                  placeholder="Enter your email" 
                  onChange={this.changeInput}/>
            </div>
            <div className="form-group">
               <label htmlFor="password-input">Password</label>
               <Input 
                  type="password" 
                  className="form-control" 
                  id="password-input" 
                  placeholder="Enter password" 
                  onChange={this.changeInput}/>
            </div>
            <Submit 
               type="submit" 
               className="btn btn-primary">Login</Submit>
            <Label color={labelColor}>{labelMessage}</Label>
         </Form>
      )
   }
}