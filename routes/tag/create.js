const tagService = require('../../services/tag.service');

module.exports = function (req, res) {
    tagService.create(req.body)
        .then(tag => {
            res.send(tag);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};