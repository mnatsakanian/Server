const resultService = require('../../services/resultService');

module.exports = function (req, res) {
    resultService.getById(req.params.id)
        .then(result => {
            if (result) {
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};