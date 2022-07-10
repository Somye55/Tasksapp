const mongoose = require('mongoose');
const username = process.env.USERNAME
const PASSWORD = process.env.PASSWORD
const URI = 'mongodb+srv://ashgreninja:ashgreninja@notesapp.b6q1d.mongodb.net/?retryWrites=true&w=majority'
// const URI = 'mongodb://localhost:27017/notes'
// Could have used environment variables 'process-env.USERNAME' and 'process.env.PASSWORD' in URI but kept the string so that you can access the application without wasting time creating mongo cluster.


const connectToMongo = () => {
    mongoose.connect(URI,()=>{
        console.log("Connected to Mongodb!")
    })
}
module.exports = connectToMongo

