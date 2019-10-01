const resultService = require('../../services/resultService');
const jwt = require('jsonwebtoken');

module.exports = function (req, res) {

    let token = req.headers.authorization;
    if (!token) return res.sendStatus(401);

    let userToken = token.split(" ")[1];
    let user = jwt.decode(userToken)

    resultService.toggleShareResult(req.body, user.sub)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};