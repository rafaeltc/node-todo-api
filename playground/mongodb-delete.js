const {MongoClient,ObjectID} = require('mongodb'); //using object destructuring


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('unable to connect to mongodb server',err);
    }
   
    console.log('connected to mongodb');
    const db = client.db('TodoApp');
   
   //delete many
    db.collection('Todos').deleteMany({text:'eat lunch'}).then((result) => {
        console.log(result);
    });

    console.log("----------------------------------");

    //delete one
    db.collection('Todos').deleteOne({delete:true}).then((result) => {
        console.log(result);
    })

    console.log("----------------------------------");

    //find one and delete
    db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
        console.log(result);
    })
   
    //client.close();
});
