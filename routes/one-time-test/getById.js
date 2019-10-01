const oneTimeTestService = require('../../services/oneTimeTest.service');

module.exports = function (req, res) {
    oneTimeTestService.getById(req.params.id)
        .then(oneTimeTest => {
            if (oneTimeTest) {
                res.send(oneTimeTest)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};