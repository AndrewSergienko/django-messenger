export default class Server {
   constructor() {
      this._apiBase = 'http://127.0.0.1:8000/api'
   }

   async postResource(url, method, data) {
      return await fetch(`${this._apiBase}${url}`, {
         method: method,
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      })
   };

   // Get token for login
   loginUser = async (email, password) => {
      const data = {email, password};
      return await this
                     .postResource('/auth/', 'POST', data)
                     .then(errors => errors.json());
   }

   // Registration user
   registrationUser = async (email, username, password, first_name) => {
      const data = {email, username, password, first_name};
      return await this
                     .postResource('/users/', 'POST', data)
                     .then(errors => errors.json())
                     .catch(() => {return});
   }
}