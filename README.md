# Django Messenger Documentation
Тимчасова документація по проекту для розробки
## API
Позначення `domen/` - `http://127.0.0.1:8000/`</br>
```
Типи даних:
<date> - format: <year>-<month>-<day>T<hour>:<minutes>:<seconds>.<miliseconds>
Example: 2022-04-04T16:07:03.233482Z
```
### Auth
* `domen/api/auth/`
  * `POST` - Залогінити юзера
  ```
  request form data:
  - email
  - password
  
  response:
  OK - HTTP 200
  - token
  
  ERROR - HTTP 401
  ```
### User
* `domen/api/users/`</br>
  * `POST` - Створити юзера</br>
  ```
  request form data:
  - email
  - username
  - password
  - first_name
  - last_name (opt)
  
  response: 
  OK - HTTP 201
  ERROR - HTTP 400
  ```
* `domen/api/users/<int>`
  * `GET` - отримати інфу про юзера
  > Якщо вказати domen/api/users/me то повернеться інфа про залогіненого юзера
  ```
  response:
  OK - HTTP 200
  - id <int>
  - last_login <date>
  - is_superuser <bool>
  - username <str>
  - first_name <str>
  - last_name <str>
  - email <str>
  - is_active: <bool>
  - date_joined <date>
  - phone <str>
  
  ERROR - HTTP 404
  ```
