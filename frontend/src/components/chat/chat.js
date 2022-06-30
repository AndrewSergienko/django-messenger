import React, { Component } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Server from '../../services/server';

import ChatSideBar from '../chatSideBar/chatSideBar';
import Messages from '../messages';

import LogoutImage from '../../assets/log-out.png';

export default class Chat extends Component {
   server = new Server(); 
   chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${this.props.authToken}/`);

   state = {
      chats: [],
      activeChat: 0,
      messages: [],
      me: {},
      friend: {}
   }

   componentDidMount() {
      const {chatList, authToken} = this.props;
      this.userInfo('me');
      chatList(authToken).then(response => {
         this.setState({chats: response});
      })
   }

   chatMessages = async (chatId, messagesCount) => {
      const result = await this.server.getChatMessages(this.props.authToken, chatId, messagesCount);
      this.setState({messages: result.reverse()})
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

   userInfo = async (id) => {
      const result = await this.server.getUserInfo(this.props.authToken, id);
      if (id === 'me') {
         this.setState({me: result});
      } else {
         this.setState({friend: result});
      }
   }

   logout = () => {
      localStorage.removeItem('authKey');
      window.location.reload();
   }

   messageNotify = (data) => data.message && toast.info(
      <>
         <NotifyTitle>{data.message.user.first_name} {data.message.user.last_name}</NotifyTitle>
         <NotifyText>{data.message.text}</NotifyText>
      </>, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
   });

   chatCreatedNotify = (data) => data.message && toast.info(
   <NotifyTitle>{data.message.user.first_name} {data.message.user.last_name} was created chat with you.</NotifyTitle>, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
   });

   render() {
      this.chatSocket.onmessage = (event) => {
         const data = JSON.parse(event.data);
         data && this.messageNotify(data) && this.addNewMessageToSideBar(data);
         if (data.message && data.message.chat === this.state.activeChat) {
            this.addNewMessageToChat(data.message.chat, data.message.text, data.message.user.id);
         }
      }
      
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
               addNewMessageToSideBar={this.addNewMessageToSideBar}
               notify={this.chatCreatedNotify}
               chatSocket={this.chatSocket}/> : <ChooseChat>Select a chat to start a messaging</ChooseChat>}
            <StyledNotify
               position="top-right"
               autoClose={5000}
               newestOnTop
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
            />
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

const StyledNotify = styled(ToastContainer)`
   .Toastify__progress-bar {
      height: 2px;
      background: #0D6EFD;
   }
   .Toastify__toast-icon {
      display: none;
   }
`

const NotifyTitle = styled.h4`
   width: 290px;
   margin: 0;
   color: #000;
   font-size: 16px;
   font-weight: bold;
`

const NotifyText = styled.p`
   width: 290px;
   margin: 10px 0 0 0;
   font-size: 14px;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
`