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
  
  ERROR - HTTP 400 -> Помилка авторизації. В тілі може бути два варіанта відповіді:
   - "email": ["not exist"] -> користувач з таким email не існує;
   - "password": ["not correct"] -> неправильний пароль.
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
  
  ERRORS:
  HTTP 400 - Помилка реєстрації. Більш детальна інформація вказана в тілі відповіді у форматі <field>: [<errors>].
  Список полів і помилки, пов'язані з ними:
  email:
   - "no value" -> поле пусте;
   - "user exist" -> користувач з таким email вже існує;
   - "not valid" -> email не пройшов валідацію.
 
  password:
   - "no value" -> поле пусте;
   - "short" -> пароль має довжину < 8 символів;
   - "common" -> пароль дуже поширений;
   - "onlynums" -> пароль містить тільки цифри.
 
  username:
   - "no value" -> поле пусте;
   - "short" -> довжина поля < 4 символа;
   - "user exist" -> username вже зайнятий;
  
  first_name:
   - "no value" -> поле пусте;
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
