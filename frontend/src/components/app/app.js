import React, { Component } from 'react';
import Login from '../login';
import Registration from '../registration';

export default class App extends Component {
   state = {
      authToken: "",
      error: false,
      redirect: false
   }

   // Get token for authorization
   loginUser = async (email, password) => {
      let url = 'http://127.0.0.1:8000/api/auth/',
          data = {email, password};

      const auth = await fetch(url, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      }).then(response => response.json());

      // if don't get show error message
      if (auth.status === 'Invalid data') {
         this.setState({error: true});
      } else {
         this.setState({error: false});
         this.setState({ authToken: auth.token });
         console.log(this.state.authToken);
      }
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

   redirectToOtherPage = () => {
      this.setState({redirect: !this.state.redirect});
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

      const { redirect } = this.state,
            page = redirect ? <Registration registrationUser={this.registrationUser} error={this.state.error} redirectToOtherPage={this.redirectToOtherPage}/> : 
                              <Login loginUser={this.loginUser} error={this.state.error} redirectToOtherPage={this.redirectToOtherPage}/>;

      return (
         <div className="App">
            { page }
         </div>
      );
   }
}
