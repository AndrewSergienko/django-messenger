export default class Server {
   constructor() {
      this._apiBase = 'http://127.0.0.1:8000/api'
   }

   async getResource(url, method, data) {
      const res = await fetch(`${this._apiBase}${url}`, {
         method: method,
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json'
         }
      })
      .then(result => result.json())
      .catch(err => err);

      if (!res.ok) {
         // TODO: Error handler
         for (const [key, value] of Object.entries(res)) {
            return [key, value];
         }

         throw new Error(`Could not fetch ${url}, status: ${res.status}.`);
      }

      return await res.json();
   };

   // Get token for login
   loginUser = async (email, password) => {
      const data = {email, password};
      return await this.getResource('/auth/', 'POST', data);
   }

   // Registration user
   registrationUser = async (email, username, password, first_name) => {
      const data = {email, username, password, first_name};
      return await this.getResource('/users/', 'POST', data);
   }
}