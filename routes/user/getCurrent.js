const userService = require('../../services/user.service');
const jwt = require('jsonwebtoken');

module.exports = function (req, res) {
    let token = req.headers.authorization;
    if (!token) return res.sendStatus(401);

    let userToken = token.split(" ")[1];
    let user = jwt.decode(userToken);
    userService.getById(user.sub)
        .then(user => {
            if (user) {
                res.send(user)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(400).send(err);
        });
};