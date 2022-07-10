const express = require('express');
const app = express()
const connToMongo = require('./db')
const userRoutes = require('./routes/user')
const notesRoutes = require('./routes/notes')
const fetchuser = require('./middleware/fetchuser')
const {body, validationResult} = require('express-validator')
const port = process.env.PORT || 5000
const cors  = require('cors');
const path =  require('path');
require('dotenv').config({ path: './TEST.env' });
app.use(cors());
connToMongo();
app.use(express.json())
// app.get('/',(req,res)=>{
//     console.log('Game on!')
//     res.send("Welcome to Notes App!");
// })
app.use('/user',userRoutes)
app.use('/notes/',notesRoutes)
if (true) {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '/build')))
  
    app.get('*', (_, response) => {
      response.sendFile(path.join(__dirname, '/build/index.html'))
    })
  } else {
    app.get('/', (_, response) => {
      response.json({ message: 'Welcome to the Support Desk API' })
    })
  }
app.listen(port,()=>{
    console.log( ` Connected to port ${port}! `)
})
