const testService = require('../../services/test.service');

module.exports = function (req, res) {
    testService.update(req.params._id, req.body)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};