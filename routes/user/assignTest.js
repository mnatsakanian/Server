const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.assignTest(req.body.userId, req.body.testId)
        .then((user) => {
            res.send(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};