const oneTimeTestService = require('../../services/oneTimeTest.service');

module.exports = function (req, res) {
    oneTimeTestService.create(req.body)
        .then((oneTimeTest) => {
            res.send(oneTimeTest);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};