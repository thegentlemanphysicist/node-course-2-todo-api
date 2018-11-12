const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
  _id: userOneID,
  email: 'jon@blah.blah',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'},'abc123').toString()
  }]
}, {
  _id: userTwoID,
  email: 'jon2@blah.blah',
  password: 'userTwoPass'
}];

const todos = [{
  _id: new ObjectID(),
  text: 'Dirst test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=> {
    Todo.insertMany(todos)
  }).then(()=>done()) ;
};

const populateUsers = (done) => {
  User.remove({}).then(()=> {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(()=>done());
}

module.exports = {todos, populateTodos, users, populateUsers};