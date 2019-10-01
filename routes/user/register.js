const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.create(req.body)
        .then(() => {
            return userService.authenticate(req.body.email, req.body.password);
        })
        .then((user) => {
            return res.json(user)
        })
        .catch(err => {
            res.status(400).send(err);
        });
};