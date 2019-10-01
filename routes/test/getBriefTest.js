const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.getBriefById(req.params.id)
        .then(test => {
            if (test) {
                let brief = test.toObject();
                delete brief.questions;
                res.send(brief);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};