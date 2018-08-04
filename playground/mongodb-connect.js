// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //using object destructuring

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('unable to connect to mongodb server',err);
    }
   
    console.log('connected to mongodb');
    const db = client.db('TodoApp');
   
    // db.collection('Todos').insertOne({
    //     text: 'some text',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert todo',err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert new doc into  Users (name, age, location)
    db.collection('Users').insertOne({
        name: 'Jose Rafael',
        age: 31,
        location: 'Lisbon'
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert todo',err);
        }
        console.log(JSON.stringify(result.ops,));
    });

    client.close();
});