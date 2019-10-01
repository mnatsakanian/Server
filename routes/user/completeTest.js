const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.completeTest(req.body.result, req.body.shared)
        .then((result) => {
            res.send(result);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};