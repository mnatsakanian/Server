const tagService = require('../../services/tag.service');

module.exports = function (req, res) {
    tagService.delete(req.params['_id'])
        .then(data => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};