import React, { Component } from 'react';
import styled from 'styled-components';

import defaultAvatar from '../../assets/default-avatar.png';
import sendButton from '../../assets/send-button.png';

import EmptyChat from '../emptyChat';

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
      const { addNewMessageToChat, addNewMessageToSideBar, me } = this.props;
      event.preventDefault();
      
      this.props.chatSocket.send(
         JSON.stringify({
            'type': 'message',
            'chat': chatId,
            'text': this.state.message
         })
      );
      
      addNewMessageToChat(chatId, this.state.message, me.id);
      addNewMessageToSideBar({chatId: chatId, text: this.state.message, date: new Date()});
      this.setState({message: ''})
   }

   render() {
      const { activeChat, messages, me, friend } = this.props;

      return (
         <Wrap>
            {messages.length ? messages.map((message, index) => {
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
            }) : <EmptyChat/> }
            {activeChat ? <form onSubmit={(event) => this.onSubmit(event, activeChat)}>
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
   padding-top: 3.7%;
   margin-left: 27%;
   margin-bottom: 75px;
`

const Message = styled.section`
   display: flex;
   margin-right: 30px;
   padding: 25px 0;
   border-top: 1px solid #cacaca;

   &:first-child {
      border-top: none;
   }
`;

const Avatar = styled.img`
   width: 48px;
   height: 48px;
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