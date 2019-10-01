const questionService = require('../../services/question.service');

module.exports = function (req, res) {
    questionService.update(req.params._id, req.body)
        .then(question => {
            res.send(question);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};