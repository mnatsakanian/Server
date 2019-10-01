const questionService = require('../../services/question.service');

module.exports = function (req, res) {
    questionService.getById(req.params.id)
        .then(test => {
            if (test) {
                res.send(test)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};