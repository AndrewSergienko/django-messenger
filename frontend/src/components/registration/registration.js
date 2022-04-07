import React, { Component } from 'react';

import './registration.css';

export default class Registration extends Component {
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
               className='registration-form d-flex align-items-center'
               onSubmit={this.submitForm}>
               <h2>Registration</h2>
               <small className='info-message'>Already a member? You can log in here</small>
               <div className="form-group registration">
                  <label htmlFor="login-input">Username</label>
                  <input 
                     type="text" 
                     className="form-control" 
                     id="login-input" 
                     placeholder="Enter username" 
                     // onChange={this.changeInput}
                     />
               </div>
               <div className="form-group password">
                  <label htmlFor="password-input">Password</label>
                  <input 
                     type="password" 
                     className="form-control" 
                     id="password-input" 
                     placeholder="Enter password" 
                     // onChange={this.changeInput}
                     />
               </div>
               <div className="form-group f-name">
                  <label htmlFor="f-name-input">First name</label>
                  <input 
                     type="text" 
                     className="form-control" 
                     id="f-name-input" 
                     placeholder="Enter first name" 
                     // onChange={this.changeInput}
                     />
               </div>
               <div className="form-group email">
                  <label htmlFor="email-input">Email</label>
                  <input 
                     type="email" 
                     className="form-control" 
                     id="email-input" 
                     placeholder="Enter email" 
                     // onChange={this.changeInput}
                     />
               </div>
               <button 
                  type="submit" 
                  className="btn btn-primary btn-for-submit">Registration</button>
               <small className='error-message'>{errorMessage}</small>
            </form>
         </>
      )
   }
}