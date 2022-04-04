# Django Messenger Documentation
Тимчасова документація по проекту для розробки
## API
Позначення `domen/` - `http://127.0.0.1:8000/`</br>
```
Типи даних:
<date> - format: <year>-<month>-<day>T<hour>:<minutes>:<seconds>.<miliseconds>
Example: 2022-04-04T16:07:03.233482Z
```

### User
* `domen/api/users/`</br>
  * `POST` - Створити юзера</br>
  ```
  request form data:
  - username
  - password
  - first_name
  - last_name (opt)
  - phone (opt)
  - email (opt)
  (phone і email по окремості не обов'язкові, але потрібно щоб був один із них)
  
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
