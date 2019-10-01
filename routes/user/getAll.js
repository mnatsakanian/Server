const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.getAll()
        .then(tests => {
            res.send(tests);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};