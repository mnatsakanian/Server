const models = require('../models');
const User = models.User;
const Result = models.Results;
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    let token = req.headers.authorization;
    let userId;
    if (token) {
        let userToken = token.split(" ")[1];
        userId = jwt.decode(userToken).sub;
    }

    return Result.findById(req.params.id).populate('user')
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(404).send('No such result');
            }
            if ((!userId || result.user._id.toString() !== userId.toString()) && !result.shared) {
                return res.status(401).send('Owner didn`t share this result yet');
            }
            next();
        })
        .catch(error => {
            res.status(500).send(error)
        });
};