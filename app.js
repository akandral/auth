require('dotenv').config();
const parser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(parser.urlencoded({extended:true}));
//////////////////MONGOOSE//////////////////////////////////////
//SERVER.CONNECT
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})
//SCHEMA
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//ENCRYPT userSchema - encrypts on newUser.save(); and decrypts on User.findOne();

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});
//MODEL
const User = new mongoose.model("User", userSchema);

////////////////////////////////////////////////////////////////

app.get("/", (req, res) =>{
  res.render("home")
});
app.get("/login", (req, res) =>{
  res.render("login")
});
app.get("/register", (req, res) =>{
  res.render("register")
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });// newUser
  newUser.save((err)=> {
    if(err){
      console.log(err);
    } else {
      res.render("secrets");// if user has registered he sees the "secrets" page
    }
  });

})//app.post("/register")

app.post("/login", (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
    if(err){
      console.log(err);
    } else {
      if(foundUser) { //if such a username found in DB...
        if(foundUser.password === password){ //...we will check if password in our db===password
          //that user just entered and stored in const password
          res.render("secrets");
        }//foundUser.password===password
      }//foundUser
    }//else
  });// user.findOne

});//app.post("/login")

app.listen(3000, ()=>{
  console.log("server is up and running on port 3000");
});
