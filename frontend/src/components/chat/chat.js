import React, { Component } from 'react';
import ChatSideBar from '../chatSideBar/chatSideBar';

export default class Chat extends Component {
   state = {
      chats: []
   }

   componentDidMount() {
      const {chatList, authToken} = this.props;
      chatList(authToken).then(response => {
         this.setState({chats: response});
      })
   }

   render() {
      return (
         <ChatSideBar chats={this.state.chats}/>
      )
   }
}