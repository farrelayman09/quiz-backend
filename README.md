# Quizzer API

A scalable and robust backend API for handling online tryouts, developed using Express, TypeScript, and MongoDB. The API is fully integrated into the [Quizzer][QuizzerFE-url] web application, enabling seamless interaction between the user interface and backend services.

## Description

Practice tests (tryout) web application implementing robust access control with JWT access and refresh tokens, using middlewares to restrict endpoint access based on user roles and tryout ownership. Users can effectively manage their tryouts, manage questions within them, take tryouts and access their past submissions for review.

## Built With

[![Express][Express.js]][Express-url] [![Typescript][Typescript]][Typescript-url] [![JWT][JWT]][JWT-url] [![MongoDB][MongoDB]][MongoDB-url] 

## Features

* Tryout Management: Create and manage tests with various questions
* Questions Management: Add and manage questions including multiple choice, true/false or short answer formats  
* Add & View Previous Submissions: Record and review user submissions, scores and their answers
* Authentication: JWT-based authentication and authorization utilizing access and refresh tokens


## Getting Started


### Dependencies

* [Node.js][Node-url] (latest)
* [MongoDB][MongoDB-url] (latest)

### Installing

1. Clone the repository
``` 
git clone https://github.com/farrelayman09/quizzer-backend.git
cd quizzer-backend
```

2. Install dependencies:
```
npm install
```
3. Set up .env file (environment variables), for  example:

```
PORT=3000
DATABASE_URL=mongodb://localhost/quiz
ACCESS_TOKEN_SECRET=<YOUR_ACCESS_TOKEN_SECRET>
REFRESH_TOKEN_SECRET=<YOUR_REFRESH_TOKEN_SECRET>
```

### Database setup

```
mongosh --eval "use quiz"
```

### Executing program

```
npm run dev
```

## API Contract

### Auth Group
| Routes              | Method | Authentication | JSON Request Body            | Action                                          |
|---------------------|--------|----------------|------------------------------|-------------------------------------------------|
| /auth/register      | POST   | -              | {"username": , "password": } | Return new User: {username, psw, _id, and logs} |
| /auth/login         | POST   | -              | {"username": , "password":}  | Return accessToken dan user: {username, _id}    |
| /auth/refresh-token | POST   | User           | -                            | Return new accessToken                          |
| /auth/logout        | DELETE | User           | -                            | -                                               |



### Tryout Group
| Routes                   | Method | Authentication | JSON Request Body       | Action                                                 |
|--------------------------|--------|----------------|-------------------------|--------------------------------------------------------|
| /tryout/                 | POST   | User           | {"title": ,"category":} | Return newly created tryout                            |
| /tryout/                 | GET    | -              | -                       | Return all tryout                                      |
| /tryout/ready            | GET    | -              | -                       | Return all tryout with status=== 'ready' \|\| 'locked' |
| /tryout/:id              | GET    | -              | -                       | Return tryout with the id                              |
| /tryout//by-user/:userId | GET    | -              | -                       | Return all tryout created by user with the userId      |
| /tryout/by-me            | GET    | -              | -                       | Return all tryout created by current logged-in user    |
| /tryout/:id              | DELETE | User           | -                       | Delete tryout with the id, only if status!==='locked'  |
| /tryout/:id              | PUT    | User           | non-restrictive         | Edit tryout with the id, only if status!==='locked'  |  



### Question Group
| Routes                            | Method | Authentication | JSON Request Body | Action                                                                                 |
|-----------------------------------|--------|----------------|-------------------|----------------------------------------------------------------------------------------|
| /tryout/:id/questions             | POST   | User           | seen below*       | Return newly created question                                                          |
| /tryout/:id/questions             | GET    | User           | -                 | Return all questions                                                                   |
| /tryout/:id/auth-questions        | GET    | User           | -                 | Return all question thats owned by the logged-in user or tryout status is ready/locked |
| /tryout/:id/questions/:questionId | DELETE | User           | -                 | Delete question with the questionId, only if status!==='locked'                        |
| /tryout/:id/questions/:questionId | PUT    | User           | non-restrictive   | Edit question with the questionId, only if status!==='locked'                          |



### *Question POST body example
| multiple choice                                                                                                                                         | short_answer                                                                                           | true_false                                                                                                 |
|---------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
|   {     "question_text": "1 == 1",     "question_type": "multiple_choice",     "choices":["mungkin","pasti","salah"],     "correct_answer": "pasti"   } |   {     "question_text": "5*20=",     "question_type": "short_answer",     "correct_answer": "100"   } |   {     "question_text": "5*20===100",     "question_type": "true_false",     "correct_answer": "true"   } |        


### Submission Group
| Routes                      | Method | Authentication | JSON Request Body | Action                                                                |
|-----------------------------|--------|----------------|-------------------|-----------------------------------------------------------------------|
| /submission/                | POST   | User           | *below            | Return newly created submission                                       |
| /submission/:id             | GET    | User           | -                 | Return submission with the id                                         |
| /submission/auth-sub/:id    | GET    | User           | -                 | Return submission with the id only if owned by current logged-in user |
| /submission/by-user/:userId | GET    | User           | -                 | Return all submissions done by user with the userId                   |
| /submission/by-me           | GET    | User           | -                 | Return all submissions done by current logged-in user                 |



### Submission POST body example
| Submit                                                                                                                                                                                                                                                                                                                                                                               |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| {     "tryout_id":"67c861154f5e1c4488db6093",<br>     "answers": [         <br>{             "question_id": "67c861b24f5e1c4488db60b3",             "answer": "pasti"         },         <br>{             "question_id": "67c954ca93e097be8d67da6c",             "answer": "100"         },         <br>{             "question_id": "67c9550293e097be8d67da75",             "answer": "true"         }     <br>] <br>} |                             
                                                    

## Authorization
Quizzer API utilizes JSON Web Tokens (JWT) for authentication, verifying user identity. Upon successful login, a token is provided and must be included in the Authorization header of subsequent requests to endpoints that require user authentication (as indicated by the "User" flag in the API contract). Further authorization checks, such as verifying ownership or specific permissions, are performed by the API based on user roles and the requested resource.

```
Authorization: Bearer <token>
```
<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[JWT-url]: https://jwt.io/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Node-url]: https://nodejs.org/en
[QuizzerFE-url]: https://github.com/farrelayman09/quizzer-frontend