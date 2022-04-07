import React, { Component } from 'react';
import styled from 'styled-components';

import Registration from '../registration';

export default class Login extends Component {
   state = {
      username: "",
      password: ""
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const target = event.target;
      
      if (target.id === "login-input") {
         this.setState({username: target.value});
      } else if (target.id === "password-input") {
         this.setState({password: target.value});
      }
   }

   // When form is submit
   submitForm = (event) => {
      event.preventDefault();

      this.props.getDataFromForm(this.state.username, this.state.password);
   }

   render() {
      const { error } = this.props,
            errorMessage = error ? "Incorrect data" : null;

      return (
         <Form height={500}
            className='d-flex align-items-center'
            onSubmit={this.submitForm}>
            <h2>Login</h2>
            <InfoMessage>Not a member? You can register here</InfoMessage>
            <div className="form-group">
               <label htmlFor="login-input">Username</label>
               <Input 
                  type="text" 
                  className="form-control" 
                  id="login-input" 
                  placeholder="Enter username" 
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
            <Error>{errorMessage}</Error>
         </Form>
      )
   }
}

// Styled components
export const Form = styled.form`
      flex-direction: column;
      margin: 50px auto 0 auto;
      padding-top: 40px;

      width: 450px;
      height: ${props => props.height}px;

      border-radius: 5px;
      background: #fff;

      box-shadow: 0px 0px 23px 0px rgba(0, 0, 0, 0.58);
   `;

export const InfoMessage = styled.small`
   margin: 20px 0 30px 0;
`;

export const Input = styled.input`
   width: 300px;
   margin-bottom: 20px;
`;

export const Submit = styled.button`
   width: 150px;
   margin-top: 40px;
`;

export const Error = styled.small`
   margin-top: 20px;

   font-size: 12px;
   color: #ff0000;
`;