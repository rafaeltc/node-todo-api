//library imports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

//local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;

//attaches middleware
app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(
        (doc) => {res.send(doc)},
        (err) => {res.status(400).send(err)}
    );

    //console.log(req.body);
});

app.get('/todos/', (req, res) => {
    Todo.find().then(
        (todos) => {res.send({todos});},
        (e) => {res.status(400).send(e);}
    );
});

//GET /todos/123456
app.get('/todos/:id',(req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        console.log('ID \'',id,'\' is not valid!');
        res.status(404).send();
    }
    
    Todo.findById(id).then((todo) => {
        if(!todo) {
            console.log('No TODO found for id ', id);
            return res.status(404).send();
        }
        console.log(JSON.stringify(todo, undefined, 2));
        res.status(200).send({todo});
    }).catch((e) => {
            console.log(e);
            res.status(400).send();
    });

    //validate id using isValid => 
    //404 --> send back empty send

    //query db
    //find by id
    //a) success  => send it back
        // no todo => send back 404 with empty body
    //b) error => 400 and send empty body back
});

app.delete('/todos/:id',(req,res) => {
    //get Id
    let id = req.params.id; 

    //validate the id -> not valid return 404
    if(!ObjectID.isValid(id)) {
        console.log('ID \'',id,'\' is not valid!');
        res.send(404);
    }

    //remove by id
        //success
            //if no doc send 404
            //if doc, send back with 200
        //error
            //400 with empty body

    Todo.findByIdAndRemove(id).then((todo) => {
        if(todo) {
            res.send({todo});
        }
        res.status(404).send();
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });

})


app.listen(port, () => {
    console.log(`started on port ${port}`);
})

module.exports = {app};