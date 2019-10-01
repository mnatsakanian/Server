const tagService = require('../../services/tag.service');

module.exports = function (req, res) {
    tagService.getAll()
        .then(tags => {
            res.send(tags);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};