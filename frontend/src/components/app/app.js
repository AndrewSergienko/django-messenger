import React, { Component } from 'react';
import Login from '../login';
import axios from 'axios'


export default class App extends Component {
   componentDidMount() {
      // let url = 'http://127.0.0.1:8000/api/user/login',
      //    data = {login: "testuser", password: "4y3nu@zB4St5LwW"};

      // fetch(url, {
      //       method: 'POST',
      //       body: JSON.stringify(data),
      //       headers: {
      //          'Content-Type': 'application/json'
      //       }
      //    })
      //    .then(response => response.json())
      //    .then(myJSON => console.log('Success: ', myJSON))

      // Send a POST request
      axios({
         method: 'post',
         url: 'http://127.0.0.1:8000/api/user/login',
         data: {
            firstName: 'testuser',
            lastName: '4y3nu@zB4St5LwW'
         }
      });
   }
      
   render() {
      // const result = fetch("http://127.0.0.1:8000/api/chats/")
      //    .then(res => res.json())
      //    .then(res => console.log(res))

      return (
         <div className="App">
            {/* {result} */}
            <Login/>
         </div>
      );
   }
}
