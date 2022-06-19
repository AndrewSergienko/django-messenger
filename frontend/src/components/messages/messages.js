import React, { Component } from 'react';
import styled from 'styled-components';

import defaultAvatar from '../../assets/default-avatar.png';

export default class Messages extends Component {
   componentDidUpdate() {
      window.scrollTo(0, window.innerHeight)
   }

   render() {
      const { messages, me, friend } = this.props;
      return (
         messages.map(message => {
            return <Message key={message.id}>
               <Avatar src={defaultAvatar} alt='Avatar'/>
               <section>
                  <Username>{friend.id === message.user ? `${friend.first_name} ${friend.last_name}` : `${me.first_name} ${me.last_name}`}</Username>
                  <Time>{new Date(message.date).toLocaleString('en-US', {month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false})}</Time>
                  <section>
                     <MessageText>{message.text}</MessageText>
                  </section>
               </section>
            </Message>
         })
      )
   }
}


// Styled components
const Message = styled.section`
   display: flex;
   margin: 0 30px;
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