const oneTimeTestService = require('../../services/oneTimeTest.service');

module.exports = function (req, res) {
    oneTimeTestService.delete(req.params._id)
        .then(() => {
            res.sendStatus(200);
        })
};