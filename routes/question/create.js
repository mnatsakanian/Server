const questionService = require('../../services/question.service');

module.exports = function (req, res) {
    questionService.create(req.body)
        .then(question => {
            res.status(200).send(question);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};