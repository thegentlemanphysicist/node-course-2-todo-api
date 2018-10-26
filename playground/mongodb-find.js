// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if (err){
       return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to Mongo server');
    const db = client.db('TodoApp');
    
    // db.collection('Todos').find({
    //     _id: new ObjectID('5bc6a1a623edc5050e730eaf')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // }, (err) =>{
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count().then((count)=>{
    //     console.log('Todos');
    //     console.log(`Todos count: ${count}`);
    // }, (err) =>{
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({
        name: 'Jon'
    }).toArray().then((docs)=>{
        console.log('Users');
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) =>{
        console.log('Unable to fetch users', err);
    });

    client.close();
});