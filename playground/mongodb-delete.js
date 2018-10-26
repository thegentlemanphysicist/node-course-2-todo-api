// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if (err){
       return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to Mongo server');
    const db = client.db('TodoApp');
    
    // // delete many
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) =>{
    //     console.log(result);
    // });
    // //delete one
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });
    //find one and delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) =>{
    //     console.log(result);
    // });
    // db.collection('Users').deleteMany({name: 'Elliott'}).then((result) =>{
    //     console.log(result);
    // });
    //db.collection('Todos').find({
        //     _id: new ObjectID('5bc6a1a623edc5050e730eaf')
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5bcfe447761d559f48293003')
    }).then((result) => {
        console.log(result);
    });
    
    //client.close();
});