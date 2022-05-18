import React, { Component } from 'react';

import { Form, InfoMessage, Input, Submit, Error, RedirectSpan } from '../login/login';

export default class Registration extends Component {
   state = {
      first_name: "",
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      errorMessage: "",

      inputsClass: {
         first_name: "",
         username: "",
         password: "",
         confirm_password: "",
         email: '', 
      },

      first_nameValid: false,
      usernameValid: false,
      passwordValid: false,
      confirm_passwordValid: false,
      emailValid: false,
      formValid: false
   }

   // Write entered data in inputs to state
   changeInput = (event) => {
      const name = event.target.name,
            value = event.target.value;

      this.setState({ [name]: value },
         () => { this.validationInput(name, value) }
      );
   }

   validationInput = (input, value) => {
      let classes = this.state.inputsClass;
      let { first_nameValid, usernameValid, passwordValid, confirm_passwordValid, emailValid } = this.state;

      switch(input) {
         case 'first_name':
            first_nameValid = value.length >= 2;
            classes.first_name = first_nameValid ? '' : 'border border-danger';
            break;
         case 'username':
            usernameValid = value.length >= 3;
            classes.username = usernameValid ? '' : 'border border-danger';
            break;
         case 'password':
            passwordValid = value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
            classes.password = passwordValid ? '' : 'border border-danger';
            break;
         case 'confirm_password':
            confirm_passwordValid = value === this.state.password;
            classes.confirm_password = confirm_passwordValid ? '' : 'border border-danger';
            break;
         case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            classes.email = emailValid ? '' : 'border border-danger';
            break;
         default:
            break;
      }

      this.setState({
         formErrors: classes,
         first_nameValid,
         usernameValid,
         passwordValid,
         confirm_passwordValid,
         emailValid
      }, this.validateForm);
   }

   validateForm() {
      const { first_name, username, password, confirm_password, email } = this.state.inputsClass;
      this.setState({
         formValid: !first_name && !username && !password && !confirm_password && !email
      });
   }

   // When form is submit
   submitForm = async (event) => {
      event.preventDefault();
      const { first_name, username, email, password, formValid } = this.state;
      const { registration, error, errorMsg, redirectToOtherPage } = this.props;

      if (formValid) {
         let msg = "";
         await registration(email, username, password, first_name);

         if (error) {
            if (errorMsg) {
               for (const key in errorMsg) {
                  msg = errorMsg[key];

                  console.log(errorMsg[key]);
               }
            } else {
               msg = "Invalid data"
            }

            this.setState({ errorMessage: msg });
            setTimeout(() => {
               this.setState({ errorMessage: "" });
            }, 5000);
         } else {
            this.setState({
               first_name: "",
               username: "",
               password: "",
               confirm_password: "",
               email: "",
               errorMessage: "Registration successful"
            });

            setTimeout(() => {
               this.setState({ errorMessage: "" });
               redirectToOtherPage();
            }, 3000);
         }
      } 
   }

   render() {
      const { errorMessage } = this.state,
            { first_name, username, password, confirm_password, email } = this.state.inputsClass;

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
               className={`form-control ${first_name}`}
               id="f-name-input" 
               placeholder="First name"
               name='first_name'
               value={this.state.first_name}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="text" 
               className={`form-control ${username}`}
               id="username-input" 
               placeholder="Username"
               name='username'
               value={this.state.username}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="email" 
               className={`form-control ${email}`}
               id="email-input" 
               placeholder="Email"
               name='email'
               value={this.state.email}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="password" 
               className={`form-control ${password}`}
               id="password-input" 
               placeholder="Password"
               name='password'
               value={this.state.password}
               onChange={this.changeInput}
               required
            />
            <Input 
               type="password" 
               className={`form-control ${confirm_password}`}
               id="c-password-input" 
               placeholder="Confirm password"
               name='confirm_password'
               value={this.state.confirm_password}
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