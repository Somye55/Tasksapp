const express = require('express');
const app = express();
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const {body,validationResult} = require('express-validator');
const Notes = require('../models/Notes');
router.get('/home',(req,res)=>{
    res.send('notes home!')
})
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes = await Notes.find({user:req.user.id})
    res.json(notes)
    } catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error!'})
      }
})
router.post('/addnote',fetchuser,[
body('title',"Enter a valid title!").isLength({ min: 2 }),
body('description',"Enter a valid description!").isLength({ min: 3 })],
async (req,res)=>{  
    try {
      console.log("addnote route")
      const {title,description,tag} = req.body;
      const user  = req.user.id
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });}
      const note = new Notes({
        title,description,tag,user
      })
      const savenote = await note.save()
    res.json(savenote)
      
        
    } catch (error) {
        console.log(error)
        res.status(401).send({error:"Couldn't match the token!"});
        
    }

    
})
router.put("/updatenote/:id",fetchuser, async (req,res)=>{
  const {title,description,tag} = req.body;
  const newNote = {};
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};
  const note = await Notes.findById(req.params.id)
  if(!note){
    return res.status(404).send("Not found!")
  }
  if(note.user.toString()!== req.user.id){
    return res.status(401).send("Not Allowed!")
  }
  const updatenote = await Notes.findByIdAndUpdate(req.params.id,newNote,{new:true})
  res.send(updatenote)
})

router.delete("/deletenote/:id",fetchuser, async (req,res)=>{
  const note = await Notes.findById(req.params.id)
  if(!note){
    return res.status(404).send("Not found!")
  }
  if(note.user.toString()!== req.user.id){
    return res.status(401).send("Not Allowed!")
  }
  const delnote = await Notes.findByIdAndDelete(req.params.id)
  res.json({"Success":"Note has been deleted",note:delnote})
})

module.exports = router
