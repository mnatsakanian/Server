const models = require('../models');
const User = models.User;
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.sendStatus(401);
    }

    let userToken = token.split(" ")[1];
    let user = jwt.decode(userToken);

    return User.findById(user.sub)
        .then(user => {
            if (!user) {
                return res.status(404).send('User not exist in system');
            }
            if (user.permissions.indexOf('admin') === -1) {
                return res.status(403).send('User hasn\'t admin permissions');
            }

            next();
        })
        .catch(error => {
            res.status(500).send(error)
        });
};