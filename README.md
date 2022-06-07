# Django Messenger Documentation
Тимчасова документація по проекту для розробки
## API
Позначення `domen/` - `http://127.0.0.1:8000/`</br>

### Registration
* Крок 1 - POST `domen/api/users/create_token`
```
request form data:
- email
OK - HTTP 200
ERROR - HTTP 400
email:
  - "no value" -> поле пусте;
  - "user exist" -> користувач з таким email вже існує;
  - "not valid" -> email не пройшов валідацію.
```
* Крок 2 - POST `domen/api/users/verify_token`
```
request form data:
- token
OK - HTTP 200
- email
ERROR - HTTP 400
```
* Крок 3 - POST `domen/api/users/`
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
  Помилки, які можуть бути:
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
### Auth
* POST - `domen/api/auth/`
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

### Chat
* Створити чат - POST `domen/api/chats/create`
```
request form data:
- user_id (ід друга)

response:
OK - 201

ERROR - 400
{'user_id': 'not exist'}
```
* Отримати список чатів - GET `domen/api/chats/list`
```
request headers:
- token

reposnse:
OK - HTTP 200
- id;
- type;
- friend:
  - id
  - last_login
  - is_superuser
  - first_name
  - last_name
  - is_active
  - date_joined
  - email
  - username
  - phone
- last_message:
  - id
  - text
  - date
  - chat
  - user
  - read
```
* Отримати список повідомлень чату - GET `domen/api/chats/<chat_id>/messages`
```
request headers:
- token

request params:
- messages_num (Кількість повідомлень, які потрібно отримати)
- message_id (opt)(ід крайнього повідомлення, від якого будуть взяті інші повідомлення. Якщо не вказане - беруться перші message_num повідомлень)
- direction (up or down)(opt)(Напрямок загрузки повідомлень. up - cтаріші, down - новіші)
```
