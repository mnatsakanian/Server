const questionService = require('../../services/question.service');

module.exports = function (req, res) {
    questionService.delete(req.params._id)
        .then(() => {
            res.sendStatus(200);
        })
};