require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();
const port = process.env.PORT;
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
  
});

app.delete('/todos/:id',(req,res)=>{
  //get ID
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } 
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.status(200).send({todo});
  }).catch((e) => res.status(400).send());

});

app.patch('/todos/:id', (req,res) =>{
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    console.log("The ID was not valid");
    return res.status(404).send();
  } 
  //pick only lets user modify certain fields
  let body = _.pick(req.body, ['text', 'completed']);
  if(_.isBoolean(body.completed)&& body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      console.log("The object was not valid");
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  })
});

app.post('/users', (req,res) => {
  let body = _.pick(req.body,['email','password']);
  let user = new User(body);
     
  //{
  //   email: body.email,
  //   password: body.password,
  //   tokens: [
  //     {access: 'test access string'},
  //     {token: 'test token string'}
  //   ]
  // });
  user.save().then((user) => {
    return user.generateAuthToken();
    //res.send(user);
  })
  .then((token) =>{
    res.header('x-auth', token).send(user);
  })
  .catch( (e) =>{
    res.status(400).send(e);
  })
});

app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};