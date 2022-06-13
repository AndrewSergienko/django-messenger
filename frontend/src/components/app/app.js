import React, { Component } from 'react';

import Server from '../../services/server';
import Login from '../login';
import Registration from '../registration';
import Chat from '../chat';

export default class App extends Component {
   server = new Server();

   state = {
      authToken: localStorage.getItem('authKey') ?? '',
      redirect: false,
      chatPage: ''
   }

   componentDidMount() {
      if (localStorage.getItem('authKey')) {
         this.setState({ chatPage: <Chat authToken={this.state.authToken} chatList={this.chatList}/> })
      }
   }

   login = async (email, password) => {
      const result = await this.server.loginUser(email, password);
      if (!result['token']) {
         return result;
      } else {
         localStorage.setItem('authKey', result['token']);
         this.setState({ authToken: result['token'] });
         this.setState({ chatPage: <Chat authToken={this.state.authToken} chatList={this.chatList}/> })
      }
   }

   createTokenForEmail = async (email) => {
      const result = await this.server.createToken(email);
      return result ? result : '';
   }

   verifyTokenForEmail = async (email, token) => {
      const result = await this.server.verifyToken(email, token);
      return result ? result : '';
   }

   registration = async (email, username, password, first_name, last_name) => {
      const result = await this.server.registrationUser(email, username, password, first_name, last_name);
      return result ? result : '';
   }

   chatList = async (token) => {
      const result = await this.server.getChatsList(token);
      return result ? result : '';
   }

   redirect = () => {
      this.setState({redirect: !this.state.redirect});
   }
      
   render() {
      const { redirect, chatPage } = this.state,
            page = redirect ? <Registration createTokenForEmail={this.createTokenForEmail} verifyTokenForEmail={this.verifyTokenForEmail} registration={this.registration} redirect={this.redirect}/> : 
                              <Login login={this.login} redirect={this.redirect}/>;

      return (
         <div className="App">
            { chatPage || page }
         </div>
      );
   }
}