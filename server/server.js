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
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT || 3000;

//attaches middleware
app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(
        (doc) => {res.send(doc)},
        (err) => {res.status(400).send(err)}
    );
});

app.get('/todos/', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then(
        (todos) => {res.send({todos});},
        (e) => {res.status(400).send(e);}
    );
});

//GET /todos/123456
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        console.log('ID \'',id,'\' is not valid!');
        res.status(404).send();
    }
    
    Todo.findOne({
        _id: id, 
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) {
            console.log('No TODO found for id ', id);
            return res.status(404).send();
        }
        console.log(JSON.stringify(todo, undefined, 2));
        res.status(200).send({todo});
    }).catch((e) => {
        console.log(e.message);
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, async (req,res) => {
    //get Id
    let id = req.params.id; 

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if(todo) {
            res.send({todo});
        }
        res.status(404).send();
    } catch (e) {
        console.log(err.message);
        res.status(400).send();
    }
})

app.patch('/todos/:id', authenticate, (req,res) => {
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

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set:body}, {new: true})
    .then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.post('/users', async (req,res) => {
    const {email,password} = req.body;
    const user = new User({email,password});

    try {
       await user.save();
       let token = await user.generateAuthToken();
       res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }    
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

// POST  /users/login {email, password}
app.post('/users/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app};