const testService = require('../../services/test.service');

module.exports = function (req, res) {
    testService.delete(req.params._id)
        .then(() => {
            res.sendStatus(200);
        })
};