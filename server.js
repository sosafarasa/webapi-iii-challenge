const express = require('express');
const helmet = require('helmet');

const server = express();

const userRouter = require("./users/userRouter.js");

server.use(logger);
server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

server.use("/api/users", userRouter);

//custom middleware

function logger(req, res, next) {
  const time = new Date().toLocaleTimeString();
  console.log(`
  request: ${req.method} 
  path: ${req.path} 
  time: ${time}`
  );
  next();
};

module.exports = server;
