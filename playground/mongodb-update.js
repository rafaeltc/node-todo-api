const {MongoClient,ObjectID} = require('mongodb'); //using object destructuring


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('unable to connect to mongodb server',err);
    }
   
    console.log('connected to mongodb');
    const db = client.db('TodoApp');
   
   db.collection('Todos').findOneAndUpdate(
       { _id: new ObjectID('5b5dac545120d59c607fb213')}, 
       { $set : {completed: true} }, 
       { returnOriginal: false }
    ).then((result) => {
        console.log(result);
    });   
    //client.close();
});
