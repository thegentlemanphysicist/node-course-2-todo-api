require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {authenticate} = require('./middleware/authenticate')
var {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res)=>{
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req,res)=>{
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req,res) =>{
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } 
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
    if (todo) {
      return res.status(200).send({todo});
    } else {
      return res.status(404).send();
    }
  }).catch((e) => res.status(400).send());
  
});

app.delete('/todos/:id',authenticate, async (req,res)=>{
  //get ID
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } 

  try{
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      res.status(404).send()
    } else {
      res.status(200).send({todo});
    };
  } catch (e) {
    res.status(400).send()
  };
  

  ////Done not using async and await
  // Todo.findOneAndRemove({
  //   _id: id,
  //   _creator: req.user._id
  // }).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send();
  //   }
  //   return res.status(200).send({todo});
  // }).catch((e) => res.status(400).send());

});

app.patch('/todos/:id', authenticate, (req,res) =>{
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
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user.id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      console.log("The object was not valid");
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  })
});

app.post('/users', async (req,res) => {
  const body = _.pick(req.body,['email','password']);
  const user = new User(body);
     
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  };
////Done not using async and await
  // user.save().then(() => {
  //   return user.generateAuthToken();
  //   //res.send(user);
  // })
  // .then((token) =>{
  //   res.header('x-auth', token).send(user);
  // })
  // .catch( (e) =>{
  //   res.status(400).send(e);
  // })
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

app.post('/users/login', async (req,res) =>{
  const body = _.pick(req.body,['email','password']);
  
  try {
    const user = await User.findByCredentials(body.email,body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);

  } catch (e) {
    res.status(400).send();
  };
});

app.delete('/users/me/token', authenticate, async (req,res)=>{
  try {
    await  req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};