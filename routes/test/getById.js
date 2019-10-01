const testService = require('../../services/test.service');

module.exports = function (req, res) {
    testService.getById(req.params.id)
        .then(test => {
            if (test) {
                res.send(test)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};