const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5bd63cf2371bfc901a3804be11';

if (!ObjectID.isValid(id)){
  console.log('ID Not Valid');
}

// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo)=>{
//   if (!todo) {
//     return console.log('ID not found'); 
//   }
//   console.log('Todo by id', todo);
// }).catch((e) => console.log(e));

let userID = '5bd4e7ae287337fd1430ccb6';
User.findById(userID).then((user) => {
  if (!user) {
    return console.log('Id of user not found');
  }
  console.log('User by id: ', user);
}).catch((e)=>console.log(e));