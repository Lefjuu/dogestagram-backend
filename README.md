## Welcome to Social Media App

Social Media App is a dynamic web application with which we can add our own photos, share with other users, interact with them in the comments section.

- Node.js : Open source, cross-platform runtime environment for executing JavaScript code
- Express.js : Back-end web application framework running on top of Node.js
- React:  Open-source JavaScript-based user interface library. It is hugely popular for web and mobile app development.
- Redis: Open source, in-memory, NoSQL data store used primarily as an application cache or quick-response database.
- MongoDB : Document database – used by your back-end application to store its data as JSON (JavaScript Object Notation) documents

### Documentation
- [API DOCS](https://dogestagram-bn.onrender.com/api-docs/) - All routes and schemas needed for queries (the page loads in about 30 seconds )

### Installation

```
git clone https://github.com/Lefjuu/dogestagram-backend
create your env file
npm install
npm start 
launching the frontend -> https://github.com/Lefjuu/dogestagram-frontend
```

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [validator](https://github.com/validatorjs/validator.js) - A library of string validators and sanitizers
- [Redis](https://github.com/redis/node-redis) - Application cache or quick-response database
- [aws-sdk](https://github.com/aws/aws-sdk) - Used to store files, in the case of this application: images
- [swagger](https://github.com/swagger-api/swagger-editor) -Swagger Editor lets you edit OpenAPI API definitions in YAML inside your browser and to preview documentations in real time. 

## Application Structure

- `index.js` - The entry point to our application. Its task to run our application.
- `app.js` -  This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes  from appropriate folder we'll be using in the application. It also contains the socket.io connection and the entire swagger configuration
- `config/` - This folder contains file with environment variables from env file.
- `services/` - This folder contains middleware and import routes from entire folder routes
- `api/routes/` - This folder contains the route definitions for our API.
- `api/models/` - This folder contains the schema definitions for our Mongoose models.
- `api/controllers/` - This folder contains as functions that are used for the appropriate routes.
- `api/services/` - This folder contains any database query and any other activity
- `utils/` - This folder contains extra features that wouldn't fit in other folders

## Authentication

To ensure secure requests, we use the `Authorization` header with a valid JWT to authenticate requests. To implement this, we have defined two express middlewares in `routers/auth.routes.js` that can be utilized for request authentication. The required middleware configures the `jwt` middleware using our application's secret, which will result in a `401 status code if the request cannot be authenticated`. The payload of the JWT can then be accessed from req.payload in the endpoint. The optional middleware is configured the same way as `required`, but it will not return a 401 status code if the request cannot be authenticated.
