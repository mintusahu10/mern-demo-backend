const mongoose= require("mongoose");
const dotenv = require("dotenv");
const   express  = require("express");
 const app = express();
 //const express = require('express');
const cookieParser = require('cookie-parser')

//const app = express();

app.use(cookieParser())

 dotenv.config({path: './config.env'});
 require('./db/conn');

 //const User = require("./model/userSchema");
  
 app.use(express.json());
 

 // we link the router files to make our route easy
  app.use(require('./router/auth'));
  const PORT = process.env.PORT || 8000;
    
 // middleware 
  



 // routing 

  // app.get("/" ,(req, res)=>{
  //       res.send(" hello world from server app.js");
  // });

  



  // listening 
  app.listen(PORT,(()=>{
    console.log(`server is running at port number : ${PORT}`);
  }))
