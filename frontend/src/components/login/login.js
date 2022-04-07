import React, { Component } from 'react';
import styled from 'styled-components';

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
         <LoginForm 
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
         </LoginForm>
      )
   }
}

// Styled components
const LoginForm = styled.form`
      flex-direction: column;
      margin: 50px auto 0 auto;
      padding-top: 40px;

      width: 450px;
      height: 500px;

      border-radius: 5px;
      background: #fff;

      box-shadow: 0px 0px 23px 0px rgba(0, 0, 0, 0.58);
   `;

const InfoMessage = styled.small`
   margin: 20px 0 30px 0;
`;

const Input = styled.input`
   width: 300px;
   margin-bottom: 20px;
`;

const Submit = styled.button`
   width: 150px;
   margin-top: 40px;
`;

const Error = styled.small`
   margin-top: 20px;

   font-size: 12px;
   color: #ff0000;
`;