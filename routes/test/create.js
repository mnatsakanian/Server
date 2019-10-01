const testService = require('../../services/test.service');

module.exports = function (req, res) {
    testService.create(req.body)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};