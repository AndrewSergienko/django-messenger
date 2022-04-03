import React, { Component } from 'react';
import Login from '../login';


export default class App extends Component {
   state = {
      authToken: ""
   }
   
   async componentDidMount() {
      const token = await this.getToken();

      this.setState({authToken: token})
   }

   async getToken() {
      let url = 'http://127.0.0.1:8000/api/auth/',
          data = {username: "testuser1", password: "abobaaboba"};

      const auth = await fetch(url, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      })
      .then(response => response.json());

      return auth.token;
   }
      
   render() {
      // const myHeaders = new Headers();
      // myHeaders.append('Content-Type', 'application/json');
      // myHeaders.append('Authorization', `Token ${this.state.authToken}`);

      // const result = fetch("http://127.0.0.1:8000/api/chats/", {
      //    method: "GET",
      //    headers: myHeaders
      // })
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
