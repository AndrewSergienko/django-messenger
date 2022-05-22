import React, { Component } from 'react';

import { Form, InfoMessage, Input, Submit, Label, RedirectSpan } from '../formInputs'

export default class Login extends Component {
   state = {
      email: "",
      password: ""
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

   // When form is submit
   submitForm = (event) => {
      event.preventDefault();

      this.props.login(this.state.email, this.state.password);
   }

   render() {
      const { error } = this.props,
            errorMessage = error ? "Incorrect data" : null;

      return (
         <Form height={500}
            className='d-flex align-items-center'
            onSubmit={this.submitForm}>
            <h2>Login</h2>
            <InfoMessage>Not a member? You can register 
               <RedirectSpan onClick={this.props.redirect}> here</RedirectSpan>
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
            <Label>{errorMessage}</Label>
         </Form>
      )
   }
}