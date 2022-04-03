import React, { Component } from 'react';

import './login.css';

export default class Login extends Component {
   render() {
      return (
         <>
            <form className='form d-flex align-items-center' action='http://127.0.0.1:8000/account/login' method='post'>
               <h2>Login</h2>
               <div className="form-group login">
                  <label htmlFor="login-input">Username</label>
                  <input type="text" className="form-control" id="login-input" placeholder="Enter username"/>
               </div>
               <div className="form-group password">
                  <label htmlFor="password-input">Password</label>
                  <input type="password" className="form-control" id="password-input" placeholder="Enter password"/>
               </div>
               <button type="submit" className="btn btn-primary btn-for-submit">Login</button>
            </form>
         </>
      )
   }
}