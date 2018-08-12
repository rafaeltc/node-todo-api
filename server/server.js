require('./config/config');

//library imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


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

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);

    //validate the id -> not valid return 404
    if(!ObjectID.isValid(id)) {
        console.log('ID \'',id,'\' is not valid!');
        res.send(404);
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new: true})
    .then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.post('/users', (req,res) => {

    var body = _.pick(req.body, ['email','password']);
    var {email,password} = req.body;

    var user = new User({email,password});

    user.save().then(() => {
        return user.generateAuthToken();
      }).then((token) => {
        res.header('x-auth', token).send(user);
      }).catch((e) => {
        res.status(400).send(e);
      });
    
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
})

module.exports = {app};