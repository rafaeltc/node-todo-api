var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minLength: 1,
//         trim: true
//     }, 
//     completed: {
//         type: Boolean,
//         default: false
//     }, 
//     completedAt: {
//         type: Number,
//         default: (new Date).getTime()
//     }
// })

// var newTodo = new Todo({
//     text: 'Walk the Dog',
//     completed: false,
//     completedAt: (new Date()).getTime()
// });

// newTodo.save().then(
//     (doc) => {console.log('Saved Todo', doc);},
//     (err) => {console.log('Unable to save Todo');}
// ) ;

var User = mongoose.model('User', {
    email : {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
});

newUser = new User({email: 'abc@c.com'});

newUser.save().then(
    (doc) => {console.log(JSON.stringify(doc,undefined,2));},
    (err) => {console.log('Unable to save', err);}
);