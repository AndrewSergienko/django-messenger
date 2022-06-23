import React, { Component } from 'react';
import styled from 'styled-components';

import defaultAvatar from '../../assets/default-avatar.png';
import sendButton from '../../assets/send-button.png';

export default class Messages extends Component {
   state = {
      message: ''
   }

   componentDidUpdate() {
      window.scroll({
         top: document.body.offsetHeight,
         left: 0, 
         behavior: 'smooth',
      }); 
   }

   onSubmit(event,  chatId) {
      const { authToken, addNewMessageToChat, addNewMessageToSideBar, messages, me } = this.props;
      event.preventDefault();
      const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${authToken}/`);
      chatSocket.onopen = (event) => {
         chatSocket.send(
            JSON.stringify({
               'type': 'message',
               'chat': chatId,
               'text': this.state.message
            })
         );
         addNewMessageToChat(messages[0].chat, this.state.message, me.id);
         addNewMessageToSideBar({chatId: messages[0].chat, text: this.state.message, date: new Date()});
         this.setState({message: ''})
      }
   }

   render() {
      const { authToken, addNewMessageToChat, addNewMessageToSideBar, activeChat, messages, me, friend } = this.props;
      const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${authToken}/`);
      
      chatSocket.onmessage = (event) => {
         const data = JSON.parse(event.data);
         addNewMessageToSideBar(data);
         if (data.message.chat === activeChat) {
            addNewMessageToChat(data.message.chat, data.message.text, data.message.user.id);
         }
      }

      return (
         <Wrap>
            {messages.map((message, index) => {
               return <Message key={index}>
                  <Avatar src={defaultAvatar} alt='Avatar'/>
                  <section>
                     <Username>{friend.id === message.user ? `${friend.first_name} ${friend.last_name}` : `${me.first_name} ${me.last_name}`}</Username>
                     <Time>{new Date(message.date).toLocaleString('en-US', {month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false})}</Time>
                     <section>
                        <MessageText>{message.text}</MessageText>
                     </section>
                  </section>
               </Message>
            })}
            {activeChat ? <form onSubmit={(event) => this.onSubmit(event, messages[0].chat)}>
               <Input 
                  type='text' 
                  placeholder='Enter your message...' 
                  value={this.state.message}
                  onChange={(e) => this.setState({message: e.target.value})}
                  required/>
               <Send type='submit'>
                  <img src={sendButton} alt='Send'/>
               </Send>
            </form> : ''}
         </Wrap>
      )
   }
}


// Styled components
const Wrap = styled.section`
   margin-left: 27%;
   margin-bottom: 25px;
`

const Message = styled.section`
   display: flex;
   margin-right: 30px;
   padding: 25px 0;
   border-top: 1px solid #cacaca;
`;

const Avatar = styled.img`
   width: 48px;
   margin-right: 20px;
   border-radius: 50%;
`

const Username = styled.span`
   margin-right: 15px;
   font-size: 16px;
   font-weight: bold;
`

const MessageText = styled.span`
   width: 100%;
   font-size: 14px;
`

const Time = styled.span`
   font-size: 12px;
`

const Input = styled.input`
   position: fixed;
   bottom: 0;
   width: 69%;
   margin: 20px 0;
   padding: 10px;

   border-radius: 5px;
   border: 1px solid #cacaca;

   &:focus {
      box-shadow: none !important;
      outline: none !important;
   }
`;

const Send = styled.button`
   position: fixed;
   bottom: 0;
   right: 0;
   margin: 20px 20px 25px 20px;
   background: none;
   border: none;
   transition: 0.2s;

   &:hover {
      transform: scale(110%);
   }
`;