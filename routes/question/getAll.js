const questionService = require('../../services/question.service');

module.exports = function (req, res) {
    questionService.getAll()
        .then(questions => {
            res.send(questions);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};