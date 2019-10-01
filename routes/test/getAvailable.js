const testService = require('../../services/test.service');
const jwt = require('jsonwebtoken');

module.exports = function (req, res) {
    let token = req.headers.authorization;
    if (!token) return res.sendStatus(401);

    let userToken = token.split(" ")[1];
    let user = jwt.decode(userToken);

    testService.getAvailable(user.sub)
        .then(tests => {
            res.send(tests);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};