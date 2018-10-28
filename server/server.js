let express = require('express');
let bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();

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

app.listen(3004, () =>{
  console.log('Started on port 3004');
});

module.exports = {app};