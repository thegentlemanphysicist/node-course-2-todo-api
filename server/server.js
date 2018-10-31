let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();
const port = process.envPORT || 3004
app.use(bodyParser.json());

app.post('/todos', (req,res)=>{
  let todo = new Todo({
    text: req.body.text,
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req,res)=>{
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res) =>{
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } 
  Todo.findById(id).then((todo)=>{
    if (todo) {
      return res.status(200).send({todo});
    } else {
      return res.status(404).send();
    }
  }).catch((e) => res.status(400).send());
  
})

app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};