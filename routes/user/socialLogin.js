const userService = require('../../services/user.service');

module.exports = function (req, res) {
    userService.socialLogin(req.body)
        .then((userWithToken) => {
            if (userWithToken) {
                res.send(userWithToken);
            } else {
                res.status(401).send('Something went wrong');
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err });
        });
};