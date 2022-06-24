export default class Server {
   constructor() {
      this._apiBase = 'http://127.0.0.1:8000/api'
   }

   async postResource(url, data) {
      return await fetch(`${this._apiBase}${url}`, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      })
   };

   async getResource(url, headers) {
      return await fetch(`${this._apiBase}${url}`, {headers: headers});
   };

   // Get token for login
   loginUser = (email, password) => {
      const data = {email, password};
      return this
               .postResource('/auth/', data)
               .then(errors => errors.json());
   }

   // Registration user
   createToken = (email) => {
      return this
               .postResource('/users/create_token', {email})
               .then(errors => errors.json())
               .catch(() => {return});
   }

   verifyToken = (email, token) => {
      const data = {email, token};
      return this
               .postResource('/users/verify_token', data)
               .then(errors => errors)
               .catch(() => {return});
   }

   registrationUser = (email, username, password, first_name, last_name) => {
      const data = {email, username, password, first_name, last_name};
      return this
               .postResource('/users/', data)
               .then(errors => errors.json())
               .catch(() => {return});
   }

   // Chat
   getChatsList = (token) => {
      return this
               .getResource(`/chats/list?token=${token}`, {'Authorization': `Token ${token}`})
               .then(chats => chats.json())
   }

   getChatMessages = (token, chatId, messagesCount) => {
      return this
         .getResource(`/chats/${chatId}/messages?messages_num=${messagesCount}`, {'Authorization': `Token ${token}`})
         .then(chats => chats.json())
   }

   getUserInfo = (token) => {
      return this
         .getResource(`/users/me`, {'Authorization': `Token ${token}`})
         .then(chats => chats.json())
   }
}