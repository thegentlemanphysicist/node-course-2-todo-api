// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);

// let user = {name: 'Jon', age: 34};
// let {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if (err){
       return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to Mongo server');
    // const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined,2));
    // })

    // const db = client.db('Users');
    // db.collection('Users').insertOne({
    //     name: 'Jon',
    //     age: 34,
    //     location: 'Victoria'
    // }, (err,result) => {
    //     if (err) {
    //         return console.log('Unable to add to users', err);
    //     }
    //     console.log(result.ops[0]._id.getTimestamp());
    // });


    client.close();
});