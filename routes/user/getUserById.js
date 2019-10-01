const userService = require('../../services/user.service');
const jwt = require('jsonwebtoken');

module.exports = function (req, res) {
    let userId = req.params._id;
    userService.getById(userId)
        .then(user => {
            if (user) {
                res.send(user)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};