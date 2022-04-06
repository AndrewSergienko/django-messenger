import React, { Component } from 'react';

import './login.css';

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
         <>
            <form 
               className='form d-flex align-items-center'
               onSubmit={this.submitForm}>
               <h2>Login</h2>
               <small className='info-message'>Not a member? You can register here</small>
               <div className="form-group login">
                  <label htmlFor="login-input">Username</label>
                  <input 
                     type="text" 
                     className="form-control" 
                     id="login-input" 
                     placeholder="Enter username" 
                     onChange={this.changeInput}/>
               </div>
               <div className="form-group password">
                  <label htmlFor="password-input">Password</label>
                  <input 
                     type="password" 
                     className="form-control" 
                     id="password-input" 
                     placeholder="Enter password" 
                     onChange={this.changeInput}/>
               </div>
               <button 
                  type="submit" 
                  className="btn btn-primary btn-for-submit">Login</button>
               <small className='error-message'>{errorMessage}</small>
            </form>
         </>
      )
   }
}