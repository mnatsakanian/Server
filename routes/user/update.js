const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.update(req.body)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};