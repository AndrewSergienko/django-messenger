import React, { Component } from 'react';

export default class Chat extends Component {

   render() {
      return (
         <>
            <h1>Chats</h1>
            <p>{this.props.authToken}</p>
         </>
      )
   }
}