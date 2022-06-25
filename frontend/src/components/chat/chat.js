import React, { Component } from 'react';
import styled from 'styled-components';
import Server from '../../services/server';

import ChatSideBar from '../chatSideBar/chatSideBar';
import Messages from '../messages';

import LogoutImage from '../../assets/log-out.png';

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

   logout = () => {
      localStorage.removeItem('authKey');
      window.location.reload();
   }

   render() {
      return (
         <>
            <Header>
               <LogoutBtn onClick={this.logout}>
                  <img src={LogoutImage} alt='Logout' />
               </LogoutBtn>
            </Header>
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
               addNewMessageToSideBar={this.addNewMessageToSideBar}/> : <ChooseChat>Select a chat to start a messaging</ChooseChat>}
         </>
      )
   }
}

const Header = styled.section`
   position: fixed;
   width: 100%;
   background: #fff;
   border-bottom: 1px solid #cacaca;
   text-align: end;
`

const LogoutBtn = styled.button`
   margin: 20px;
   background: transparent;
   border: none;
   transition: 0.2s;

   &:hover {
      transform: scale(110%);
   }
`

const ChooseChat = styled.p`
   position: absolute;
   top: 50%;
   width: 100%;
   padding-left: 27%;

   font-size: 20px;
   text-align: center;
`