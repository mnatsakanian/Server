const oneTimeTestService = require('../../services/oneTimeTest.service');


module.exports = function (req, res) {
    oneTimeTestService.getAll()
        .then(oneTimeTests => {
            res.send(oneTimeTests);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};