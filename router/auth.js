const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("../db/conn");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const     Authenticate   = require("../middleware/Authenticate");


router.get("/", (req, res) => {
  res.send(" hello world from server router.js");
});
// with async, await ( try and catch)

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "please fill the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password != cpassword){
      return res.status(422).json({ error: "Password are not matching" });
    }
    else{
    const user = new User({ name, email, phone, work, password, cpassword });

    // hassing fuction

    await user.save();
    res.status(201).json({ message: "user registerd successfully !!" });
    }
  }
  catch (err) {
    console.log(err);
  }
});

//  with then promises
// router.post("/register",(req,res)=>{

//     const { name, email,phone,work,password,cpassword } = req.body;
//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error: "please fill the field properly"});

//     }
//     User.findOne({email:email})
//     .then((userExist)=>{
//         if (userExist){
//             return res.status(422).json({error:"Email already Exist"});
//         }
//         const user =new User({name, email,phone,work,password,cpassword});
//         user.save().then(() => {
//             res.status(201).json({message: "user registerd successfully !!"});
//         }).catch((err)=>{
//             res.status(500).json({err: "Failed to registerd"}) });
// }).catch(err=>{console.log(err)});
// });

// login route

router.post("/signin", async (req, res) => {
  try {

    //req.body comes from front end page
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Invalid email/password" });
    }

    const userLogin = await User.findOne({ email: email });

    if(userLogin){
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken" ,token,{
        expires: new Date(Date.now() + 25892000000), 
        httpOnly:true
      });

    //console.log(isMatch);
              if (!isMatch) {
                res.status(400).json({ error: "User invalid crediential by pass!!" });
              } else {
                res.json({ message: "User  Signin successfully!!" });
              }
    } else{
      res.status(400).json({error:"User invalid crediential by email !!"})
    }

    
  } catch (err) {
    (err) => {
      console.log(err);
    };
  }
});

router.get("/about" ,Authenticate ,(req, res)=>{
 // console.log("my about");
  res.send(req.rootUser);
});

router.get("/getdata",Authenticate ,(req,res)=>{
  res.send(req.rootUser);
});

///console.log(name);
//res.send("mera register page");
//})
router.post("/contact" , Authenticate , async (req, res)=>{
  try {
    const {name,email,phone,message}= req.body;
    if(!name || !email || !phone || !message){
      console.log("Error in contact page");
      return res.json({error:"please fill the contact form"});
    }
    const userContact = await User.findOne({_id:req.userID});
    if(userContact){
      const userMessage = await userContact.addMesssage(name,email,phone,message);
      await userContact.save();
      res.status(201).json({message:"user contact successfully"});
    }
    
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout" ,(req, res)=>{
   console.log("Hello my logout Page here");
   res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("User logout");
 });

module.exports = router;
