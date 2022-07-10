const express = require('express');
const User = require('../models/User')
const {body,validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const app = express();
const fetchuser = require('../middleware/fetchuser');
const router = express.Router()
const JWT_SECRET = 'andybernardisgay'
router.get('/home',(req,res)=>{
    res.send('User home!')
})
router.post('/createuser',
body('password').isLength({ min: 5 }),
body('name').isLength({ min: 3 }),
body('email').isEmail(),
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success:false, errors: errors.array() });
    }
// check whether a user exists with similar email
const salt = await bcrypt.genSalt(10);
const pass = await bcrypt.hash(req.body.password,salt)
let user = await User.findOne({email:req.body.email})
if(!user){
user = await User.create({
    name: req.body.name,
    password: pass,
    email: req.body.email,
  })
const data = {
  user:{
  id:user.id
  }
}
const authtoken  = jwt.sign(data,JWT_SECRET)
res.json({success:true,authtoken})
}
else{
  res.status(400).json({success:false,error:'This email is already in use.'});
}

  // .then(user => res.json(user))
  // .catch(error=>{console.log(error)
  //   res.json({error:'Please enter valid details!',message:error.message})})
},
)
// test user creation with mongoose
// const Ash = User({
//     name: 'Ashgreninja55555',
//     password: 'ashgreninja55555',
//     email:'xyzgob@gmail.com'
// })
// Ash.save()
router.post('/loginuser',
body('email').isEmail(),
body('password').exists(),
async (req,res)=>{
// check whether a user exists with the given email
try {
  let user = await User.findOne({email:req.body.email});
  let password = req.body.password;
  let pass = await bcrypt.compare(password,user.password)
if(!user){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return  res.status(400).json({success:false,error:'Please enter valid credentials!'})
  }
}
if(!pass){
  return res.status(400).json({success:false,error:'Please enter valid credentials!'})
}


const data = {
  user:{
  id:user.id
  }
}
const authtoken  = jwt.sign(data,JWT_SECRET)
res.json({success:true,authtoken})
}
catch{
  res.status(500).json({success:false,error:'Internal server error!'})
}


  // .then(user => res.json(user))
  // .catch(error=>{console.log(error)
  //   res.json({error:'Please enter valid details!',message:error.message})})
})
router.post('/getuser',fetchuser,
async (req,res)=>{
try {
const userid = req.user.id;
const user = await User.findById(userid).select('-password');
res.send(user)
  
} catch (error) {
  res.status(500).json({error:'Internal server error!'})
}}
)
module.exports = router
