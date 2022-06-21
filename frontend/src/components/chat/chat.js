import React, { Component } from 'react';
import Server from '../../services/server';

import ChatSideBar from '../chatSideBar/chatSideBar';
import Messages from '../messages';

export default class Chat extends Component {
   server = new Server(); 

   state = {
      chats: [],
      messages: [],
      me: {
         id: '',
         first_name: '',
         last_name: ''
      },
      friend: {
         id: '',
         first_name: '',
         last_name: ''
      }
   }

   componentDidMount() {
      const {chatList, authToken} = this.props;
      chatList(authToken).then(response => {
         this.setState({chats: response});
      })
   }

   chatMessages = async (chatId, messagesCount, id, first_name, last_name) => {
      const result = await this.server.getChatMessages(this.props.authToken, chatId, messagesCount);
      this.setState({
         messages: result,
         friend: {
            id,
            first_name,
            last_name: last_name ? last_name : ''
         }
      })
   }

   addNewMessage = (chatId, date, text, senderId) => {
      this.setState({messages: [...this.state.messages, {chat: chatId, date, read: [], text, user: senderId}]})
   }

   userInfo = async () => {
      const result = await this.server.getUserInfo(this.props.authToken);
      this.setState({
         me: {
            id: result.id,
            first_name: result.first_name,
            last_name: result.last_name ? result.last_name : ''
         }
      })
   }

   render() {
      return (
         <>
            <ChatSideBar 
               chats={this.state.chats}
               userInfo={this.userInfo}
               chatMessages={this.chatMessages}/>
            <Messages 
               authToken={this.props.authToken} 
               messages={this.state.messages} 
               me={this.state.me} 
               friend={this.state.friend} 
               addNewMessage={this.addNewMessage}/>
         </>
      )
   }
}