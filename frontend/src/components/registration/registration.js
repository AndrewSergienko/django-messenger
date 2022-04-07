import React, { Component } from 'react';

import {Form, InfoMessage, Input, Submit, Error} from '../login/login';

export default class Registration extends Component {
   state = {
      first_name: "",
      username: "",
      password: "",
      email: ""
   }

   // // Write entered data in inputs to state
   // changeInput = (event) => {
   //    const target = event.target;
      
   //    if (target.id === "login-input") {
   //       this.setState({username: target.value});
   //    } else if (target.id === "password-input") {
   //       this.setState({password: target.value});
   //    }
   // }

   // // When form is submit
   // submitForm = (event) => {
   //    event.preventDefault();

   //    this.props.getDataFromForm(this.state.username, this.state.password);
   // }

   render() {
      const { error } = this.props,
            errorMessage = error ? "Incorrect data" : null;

      return (
         <Form 
            height={620}
            className='registration-form d-flex align-items-center'
            onSubmit={this.submitForm}>
            <h2>Registration</h2>
            <InfoMessage className='info-message'>Already a member? You can log in here</InfoMessage>
            <Input 
               type="text" 
               className="form-control" 
               id="f-name-input" 
               placeholder="First name" 
               // onChange={this.changeInput}
            />
            <Input 
               type="text" 
               className="form-control" 
               id="login-input" 
               placeholder="Username" 
               // onChange={this.changeInput}
            />
            <Input 
               type="password" 
               className="form-control" 
               id="password-input" 
               placeholder="Password" 
               // onChange={this.changeInput}
            />
            <Input 
               type="password" 
               className="form-control" 
               id="password-input" 
               placeholder="Confirm password" 
               // onChange={this.changeInput}
            />
            <Input 
               type="email" 
               className="form-control" 
               id="email-input" 
               placeholder="Email" 
               // onChange={this.changeInput}
            />
            <Submit 
               type="submit" 
               className="btn btn-primary btn-for-submit">Registration</Submit>
            <Error className='error-message'>{errorMessage}</Error>
         </Form>
      )
   }
}