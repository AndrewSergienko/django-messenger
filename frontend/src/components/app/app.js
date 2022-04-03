import React, { Component } from 'react';
import Login from '../login';


export default class App extends Component {
   componentDidMount() {
       let url = 'http://127.0.0.1:8000/api/auth/',
          data = {username: "testuser1", password: "abobaaboba"};

       fetch(url, {
             method: 'POST',
            body: JSON.stringify(data),
            headers: {
               'Content-Type': 'application/json'
             }
          })
          .then(response => response.json())
          .then(myJSON => console.log('Success: ', myJSON))}
      
   render() {
       const result = fetch("http://127.0.0.1:8000/api/chats/")
         .then(res => res.json())
         .then(res => console.log(res))

      return (
         <div className="App">
             {/*{result}*/}
            <Login/>
         </div>
      );
   }
}
