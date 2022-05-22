import React, { Component } from 'react';
import Login from '../login';
import Registration from '../registration';
import Server from '../../services/server';

export default class App extends Component {
   server = new Server();

   state = {
      authToken: "",
      error: false,
      errorInfo: {},
      redirect: false
   }

   login = async (email, password) => {
      const result = await this.server.loginUser(email, password);

      // if don't get show error message
      if (result.status === 'Invalid data') {
         this.setState({error: true});
      } else {
         this.setState({error: false});
         this.setState({ authToken: result.token });
         console.log(this.state.authToken);
      }
   }

   registration = async (email, username, password, first_name) => {
      const result = await this.server.registrationUser(email, username, password, first_name);

      return result ? result : '';
   }

   redirect = () => {
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

      const { redirect, error, errorInfo } = this.state,
            page = redirect ? <Registration registration={this.registration} error={error} errorInfo={errorInfo} redirect={this.redirect}/> : 
                              <Login login={this.login} error={error} redirect={this.redirect}/>;

      return (
         <div className="App">
            { page }
         </div>
      );
   }
}
