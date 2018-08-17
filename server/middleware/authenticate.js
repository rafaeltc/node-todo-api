var {User} = require('./../models/user');
var authenticate = (req, res, next) => {

    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;

        //we need to call next otherwise the route will never get executed
        next();
    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = {
    authenticate
};