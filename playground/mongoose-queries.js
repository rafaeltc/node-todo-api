const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

var id = '5b5dad813dcb107bf05598bc';

// if(!ObjectID.isValid(id)) {
//  console.log('ID \'', id, '\' is not valid!');
// }

// Todo.find({
//     _id : id
// }).then((todos) => {
//     console.log('Todos',todos);
// });

// Todo.findOne({
//     _id : id
// }).then((todos) => {
//     console.log('Todos',todos);
// });

// Todo.findById(id).then((todos) => {
//     if(!todos) {
//         return console.log('ID not found!');
//     }
//     console.log('Todo By Id: ',todos);
// }).catch((e) => console.log(e));

Users.findById(id)
    .then((user) => {
        if(!user) {
            return console.log('No user found for user id ', id);
        }
        console.log(JSON.stringify(user, undefined, 2));
    }, (err) => {
            if(!ObjectID.isValid(id)) {
                console.log('ID \'',id,'\' is not valid!');
            }
            else {
                console.log(err);
            }
    });