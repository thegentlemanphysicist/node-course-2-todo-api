const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//   console.log(result);
// })

//Todo.findOneAndRemove({_id: '5bdbc4d994aa949ac04746ad'}).then...
Todo.findByIdAndRemove('5bdbc4d994aa949ac04746ad').then((todo)=>{
  console.log(todo);
});