import React, { Component } from 'react';
import Server from '../../services/server';

import ChatSideBar from '../chatSideBar/chatSideBar';
import Messages from '../messages';

export default class Chat extends Component {
   server = new Server(); 

   state = {
      chats: [],
      activeChat: 0,
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

   addNewMessageToChat = (chatId, text, senderId) => {
      this.setState({
         messages: [...this.state.messages, {chat: chatId, date: new Date(), read: [], text, user: senderId}]
      })
   }

   addNewMessageToSideBar = (data) => {
      if (data.type === 'message') {
         this.setState({
            chats: this.state.chats.map(chat => {
               if (chat.id === data.message.chat) {
                  return {...chat, last_message: {text: data.message.text, date: data.message.date}}
               } else {
                  return chat
               }
            })
         })
      } else {
         this.setState({
            chats: this.state.chats.map(chat => {
               if (chat.id === data.chatId) {
                  return {...chat, last_message: {text: data.text, date: data.date}}
               } else {
                  return chat
               }
            })
         })
      }
   }

   setActiveChat = (chatId) => {
      this.setState({activeChat: chatId})
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
               chatMessages={this.chatMessages}
               setActiveChat={this.setActiveChat}/>
            { this.state.activeChat ? <Messages 
               authToken={this.props.authToken} 
               messages={this.state.messages} 
               me={this.state.me} 
               friend={this.state.friend} 
               activeChat={this.state.activeChat}
               addNewMessageToChat={this.addNewMessageToChat}
               addNewMessageToSideBar={this.addNewMessageToSideBar}/> : ''}
         </>
      )
   }
}