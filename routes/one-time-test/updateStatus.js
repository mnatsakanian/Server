const oneTimeTestService = require('../../services/oneTimeTest.service');

module.exports = function (req, res) {
    oneTimeTestService.updateStatus(req.params._id, req.body.status)
        .then((oneTimeTest) => {
            res.send(oneTimeTest);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};