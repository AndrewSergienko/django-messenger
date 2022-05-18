import React, { Component } from 'react';
import Login from '../login';
import Registration from '../registration';
import Server from '../../services/server';

export default class App extends Component {
   server = new Server();

   state = {
      authToken: "",
      error: false,
      errorMsg: "",
      redirect: false
   }

   login = async (email, password) => {
      const result = await this.server.loginUser(email, password);

      // TODO: Error handler
      console.log(result);

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

      // if don't get show error message
      if (!result.ok) {
         this.setState({error: true});
         await result.json().then(res => this.setState({ errorMsg: res }));
      } else {
         this.setState({error: false});
         await result.json().then(res => console.log(res.status));
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

      const { redirect, error, errorMsg } = this.state,
            page = redirect ? <Registration registration={this.registration} error={error} errorMsg={errorMsg} redirectToOtherPage={this.redirectToOtherPage}/> : 
                              <Login login={this.login} error={error} redirectToOtherPage={this.redirectToOtherPage}/>;

      return (
         <div className="App">
            { page }
         </div>
      );
   }
}
