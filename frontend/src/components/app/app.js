import React, { Component } from 'react';
import Login from '../login';
// import Registration from '../registration';

export default class App extends Component {
   state = {
      authToken: "",
      email: "",
      password: "",
      error: false
   }

   // Get token for authorization
   getToken = async (email, password) => {
      let url = 'http://127.0.0.1:8000/api/auth/',
          data = {email, password};

      const auth = await fetch(url, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      }).then(result => result.json());

      // if don't get show error message
      if (auth.status === 'Invalid data') {
         this.setState({error: true});
      } else {
         this.setState({error: false});
         return auth;
      }
   }

   // Get email and password from login form
   getDataFromLoginForm = async (email, password) => {
      // Send request
      await this.getToken(email, password)
            .then(result => {
               this.setState({ authToken: result.token });
               console.log(this.state.authToken);
            });
   }

   // Registration user
   registrationUser = async (email, username, password, first_name) => {
      let url = 'http://127.0.0.1:8000/api/users/',
          data = {email, username, password, first_name};

      const reg = await fetch(url, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      });

      // if don't get show error message
      if (!reg.ok) {
         this.setState({error: true});
      } else {
         this.setState({error: false});
         reg.json().then(res => console.log(res.status))
      }
   }
      
   render() {
      //  const myHeaders = new Headers();
      //  myHeaders.append('Content-Type', 'application/json');
      //  myHeaders.append('Authorization', `Token ${this.state.authToken}`);

      //  const result = fetch("http://127.0.0.1:8000/api/chats/", {
      //     method: "GET",
      //     headers: myHeaders
      //  })
      //     .then(res => res.json())
      //     .then(res => console.log(res))

      return (
         <div className="App">
            {/* {result} */}
            <Login getDataFromLoginForm={this.getDataFromLoginForm} error={this.state.error}/>
            {/* <Registration registrationUser={this.registrationUser} error={this.state.error}/> */}
         </div>
      );
   }
}
