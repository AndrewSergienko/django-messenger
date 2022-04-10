import React, { Component } from 'react';

import { Form, InfoMessage, Input, Submit, Error, RedirectSpan } from '../login/login';

export default class Registration extends Component {
   state = {
      first_name: "",
      username: "",
      password: "",
      confirm_password: "",
      email: ""
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const target = event.target;

      switch (target.id) {
         case "f-name-input":
            this.setState({first_name: target.value});
            break;
         case "username-input":
            this.setState({username: target.value});
            break;
         case "password-input":
            this.setState({password: target.value});
            break;
         case "c-password-input":
            this.setState({confirm_password: target.value});
            break;
         case "email-input":
            this.setState({email: target.value});
            break;
         default:
            break;
      }
   }

   // When form is submit
   submitForm = (event) => {
      event.preventDefault();

      console.log(this.state);

      this.props.registrationUser(this.state.email, this.state.username, this.state.password, this.state.first_name);

      if (!this.props.error) {
         this.setState({
            first_name: "",
            username: "",
            password: "",
            confirm_password: "",
            email: "",
         });
      }
   }

   render() {
      const { error } = this.props,
              errorMessage = error ? "Incorrect data" : null;

      return (
         <Form 
            height={620}
            className='registration-form d-flex align-items-center'
            onSubmit={this.submitForm}>
            <h2>Registration</h2>
            <InfoMessage className='info-message'>Already a member? You can log in 
               <RedirectSpan onClick={this.props.redirectToOtherPage}> here</RedirectSpan>
            </InfoMessage>
            <Input 
               type="text" 
               className="form-control"
               id="f-name-input" 
               placeholder="First name"
               value={this.state.first_name}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="text" 
               className="form-control"
               id="username-input" 
               placeholder="Username"
               value={this.state.username}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="password" 
               className="form-control"
               id="password-input" 
               placeholder="Password"
               value={this.state.password}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="password" 
               className="form-control"
               id="c-password-input" 
               placeholder="Confirm password"
               value={this.state.confirm_password}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="email" 
               className="form-control" 
               id="email-input" 
               placeholder="Email"
               value={this.state.email}
               onChange={this.changeInput}
               required
            />
            <Submit 
               type="submit" 
               className="btn btn-primary">Registration</Submit>
            <Error>{errorMessage}</Error>
         </Form>
      )
   }
}