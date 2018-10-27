// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if (err){
       return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to Mongo server');
    const db = client.db('TodoApp');
    
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bd2916f136083e13dd87170')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bcfe351761d559f48292f78')
    }, {
        $set: {
            name: 'Jon'
        },
        $inc: {
            age: 7
        }
    }, {
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });
    
    //client.close();
});