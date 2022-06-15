import React, { Component } from 'react';
import styled from 'styled-components';

import defaultAvatar from '../../assets/default-avatar.png';

export default class ChatSideBar extends Component {
   render() {
      return (
         <SideBar>
            {
               this.props.chats.map(chat => {
                  const { date, text } = chat.last_message;
                  const normallyDate = date ? new Date(date) : '';
                  let lastMessageDate = '';
                  
                  if (date) {
                     if (new Date(normallyDate).setHours(23, 59, 59) < Date.now()) {
                        lastMessageDate = normallyDate.toLocaleDateString();
                     } else {
                        lastMessageDate = normallyDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});
                     }
                  } else {
                     lastMessageDate = '';
                  }

                  const { id, first_name, last_name } = chat.friend;
                  return <Message key={chat.id} onClick={() => {this.props.chatMessages(chat.id, 50, id, first_name, last_name); this.props.userInfo()}}>
                     <Avatar src={defaultAvatar} alt='avatar' />
                     <Username>{first_name} {last_name ? last_name : ''}</Username>
                     <MessageText>{text}</MessageText>
                     <Time>{lastMessageDate}</Time>
                  </Message>
               })
            }
         </SideBar>
      )
   }
}


// Styled components
const SideBar = styled.section`
   width: 25%;
   height: 100vh;
   border-right: 1px solid #cacaca;
   overflow-y: auto;
`;

const Message = styled.section`
   position: relative;
   padding: 20px;
   border-bottom: 1px solid #cacaca;
   box-sizing: border-box;
   cursor: pointer;
   transition: 0.2s;

   &:hover {
      background: #eeeeee;
   }

   &:last-child {
      border-bottom: none;
   }
`;

const Avatar = styled.img`
   margin-right: 20px;
   border-radius: 50%;
`

const Username = styled.span`
   position: absolute;
   font-size: 20px;
   font-weight: bold;
`

const MessageText = styled.span`
   position: absolute;
   width: 270px;
   bottom: 20px;
   font-size: 16px;
   text-overflow: ellipsis;
   white-space: nowrap;
   overflow: hidden;
`

const Time = styled.span`
   position: absolute;
   top: 25px;
   right: 10%;
   font-size: 14px;
`