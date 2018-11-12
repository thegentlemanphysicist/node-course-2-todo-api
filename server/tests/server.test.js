const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


// const todos = [{
//   _id: new ObjectID(),
//   text: 'Dirst test todo'
// }, {
//   _id: new ObjectID(),
//   text: 'Second test todo',
//   completed: true,
//   completedAt: 333
// }];

// beforeEach((done)=>{
//   Todo.remove({}).then(()=> {
//     Todo.insertMany(todos)
//   }).then(()=>done()) ;
// });


describe('POST /todos', ()=>{
  it('should create a new todo',(done)=>{
    let text = 'test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));


    });
  });

  it('should not create todo with invalid body data', (done)=> {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=> {
      if (err){
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>done(e));
    });
  });
});

describe('GET /todos', () => {
  it ('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
    });
});

describe('GET /todos/id', () => {
  it('should return todo doc',(done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) =>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 for non object IDs', (done) => {
    request(app)
    .get('/todos/12345')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err,res)=>{
        if (err) {
          return done(err);
        }
        //query the database using find by id
        Todo.findById(hexID).then((todo) =>{
          expect(todo).toNotExist();
          done();
        })
        .catch((e)=>done(e));
      });
  });

  it('should return 404 if not found', (done) => {
    request(app)
    .delete(`/todos/${new ObjectID().toHexString}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .delete('/todos/12345')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = todos[0]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'I have been updated!',
      completed: true
    })
    .expect(200)
    .expect((res) =>{
      expect(res.body.todo.text).toBe('I have been updated!');
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
      done();
    }).catch((e) => done(e));
  });

  // const todos = [{
  //   _id: new ObjectID(),
  //   text: 'Dirst test todo'
  // }, {
  //   _id: new ObjectID(),
  //   text: 'Second test todo',
  //   completed: true,
  //   completedAt: 333
  // }];


  it('should clear completedAt when todo is not completed', (done) => {
    const id = todos[1]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'I have been updated as well!',
      completed: false
    })
    .expect(200)
    .expect((res) =>{
      expect(res.body.todo.text).toBe('I have been updated as well!');
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
      done();
    }).catch((e) => done(e));
  });
});

describe('GET /users/me', ()=>{
  it('should return user if authenticated', (done) =>{
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  })

  it('should return 401 if not authenticated', (done) =>{
    request(app)
      .get('/users/me')
      //.set('x-auth',users[1].tokens[0].token)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', ()=>{
  it('should create a user', (done) =>{
    var email ='example@example.com'
    var password = '123abc!'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) =>{
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  });

  it('should return validation errors if request invalid', (done) =>{
    var email ='exampleexample.com'
    var password = '123abc'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .expect((res)=>{
        expect(res.body.errors.email.message).toEqual(`${email} is not a valid email`);
      })
      .end(done);
  });

  it('should not create user if email in use', (done) =>{
    var email = users[0].email;
    var password = '123abc'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  });
});