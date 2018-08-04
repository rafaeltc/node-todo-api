const {MongoClient,ObjectID} = require('mongodb'); //using object destructuring


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('unable to connect to mongodb server',err);
    }
   
    console.log('connected to mongodb');
    const db = client.db('TodoApp');
   
    //find method retrives a cursor
    // db.collection('Todos').find({
    //     _id: new ObjectID('5b5dac545120d59c607fb213')
    // }).toArray().then((docs) => {
    //     console.log('TODOS:');
    //     console.log(JSON.stringify(docs,undefined,2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Todos').find().count().then((count) => {
        console.log(`TODOS count:${count}`);
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    //client.close();
});
