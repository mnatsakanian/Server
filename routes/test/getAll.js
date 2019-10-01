const testService = require('../../services/test.service');

module.exports = function (req, res) {
    testService.getAll()
        .then(tests => {
            res.send(tests);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};