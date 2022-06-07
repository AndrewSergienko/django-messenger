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

   // Get token for login
   loginUser = async (email, password) => {
      const data = {email, password};
      return await this
                     .postResource('/auth/', data)
                     .then(errors => errors.json());
   }

   // Registration user
   createToken = async (email) => {
      return await this
                     .postResource('/users/create_token', {email})
                     .then(errors => errors.json())
                     .catch(() => {return});
   }

   verifyToken = async (email, token) => {
      const data = {email, token};
      return await this
                     .postResource('/users/verify_token', data)
                     .then(errors => errors)
                     .catch(() => {return});
   }

   registrationUser = async (email, username, password, first_name, last_name) => {
      const data = {email, username, password, first_name, last_name};
      return await this
                     .postResource('/users/', data)
                     .then(errors => errors.json())
                     .catch(() => {return});
   }
}