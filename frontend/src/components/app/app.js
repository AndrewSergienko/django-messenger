import React, { Component } from 'react';
import Login from '../login';
import Registration from '../registration';
import Server from '../../services/server';

export default class App extends Component {
   server = new Server();

   state = {
      authToken: "",
      redirect: false
   }

   login = async (email, password) => {
      const result = await this.server.loginUser(email, password);
      if (!result['token']) {
         return result;
      } else {
         this.setState({ authToken: result['token'] })
      }

      console.log(this.state.authToken);
   }

   registration = async (email, username, password, first_name) => {
      const result = await this.server.registrationUser(email, username, password, first_name);
      return result ? result : '';
   }

   redirect = () => {
      this.setState({redirect: !this.state.redirect});
   }
      
   render() {
      const { redirect } = this.state,
            page = redirect ? <Registration registration={this.registration} redirect={this.redirect}/> : 
                              <Login login={this.login} redirect={this.redirect}/>;

      return (
         <div className="App">
            { page }
         </div>
      );
   }
}
