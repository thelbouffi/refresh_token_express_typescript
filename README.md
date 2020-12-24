## Prerequisites

- [Node js](https://nodejs.org/en/)
- [NPM](https://nodejs.org/)

## Getting started

1- Install dependencies by running the following command on your terminal

```bash
npm i
```

2- Start your dev server by running:

```bash
npm run dev
```

## Notes
In order to compile `typescript` code, and generate the javascript code, you need to run this command:

```bash
npm run build
```

After building the project, you can start the project by either running this command:

```bash
npm start
```

## Endpoints
**GET** http://0.0.0.0:3003/auth/  
**POST** http://0.0.0.0:3003/auth/login  
with the folowing body (deatils are on the dao):
````
{
    "username": "user2@email.com",
    "password": "password123-2"
}
````
**GET** http://0.0.0.0:3003/auth/current-user  
with the folowing authaurisation on headers: `Bearer accessToken`  
**POST** http://0.0.0.0:3003/auth/refresh
````
{
    "refreshToken": {{refreshToken}}
}
````

 
