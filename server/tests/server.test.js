const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'Dirst test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];


beforeEach((done)=>{
  Todo.remove({}).then(()=> {
    Todo.insertMany(todos)
  }).then(()=>done()) ;
});


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

