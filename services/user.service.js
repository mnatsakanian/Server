const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Test = mongoose.model('Test');
const Result = mongoose.model('Results');
const SocialCredentials = mongoose.model('SocialCredentials');
const resultService = require('./resultService');
const ObjectId = mongoose.Types.ObjectId;

const service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.emailExists = emailExists;
service.togglePermission = togglePermission;
service.assignTest = assignTest;
service.unassignTest = unassignTest;
service.completeTest = completeTest;
service.socialLogin = socialLogin;

module.exports = service;

function authenticate(email, password) {
    return User.findOne({ email: email })
        .exec()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.hash)) {
                return Promise.resolve({
                    _id: user._id,
                    email: user.email,
                    imageUrl: user.imageUrl,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthDate: user.birthDate,
                    permissions: user.permissions,
                    token: jwt.sign({ sub: user._id }, config.secret)
                })
            } else {
                return Promise.resolve();
            }
        });
}

function togglePermission(adminId, permission, userId) {
    return User.findById(adminId)
        .exec()
        .then(user => {
            if (!user.permissions.includes('admin')) {
                return Promise.reject('Trying to toggle admin without having admin privileges');
            }
            return User.findById(userId).exec();
        })
        .then(user => {
            if (!user.permissions) {
                user.permissions = [];
            }
            let permissionIndex = user.permissions.indexOf(permission);
            if (permissionIndex === -1) {
                user.permissions.push(permission);
            } else {
                user.permissions.splice(permissionIndex, 1);
            }

            return user.save()
        })
        .then(user => {
            return Promise.resolve(user)
        })
        .catch(error => {
            return Promise.reject(error);
        })
}


function emailExists(email) {
    return User.findOne({ email: email })
        .exec()
        .then(user => {
            return Promise.resolve(user);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function getAll() {
    return User.find({})
        .exec()
        .then(users => {
            users = _.map(users, (user) => {
                return _.omit(user, 'hash');
            });
            return Promise.resolve(users);
        });
}

function getById(_id) {
    return User.findById(_id)
        .populate('assignedTests')
        .exec()
        .then(user => {
            if (user) {
                return Promise.resolve(_.omit(user, 'hash'));
            } else {
                return Promise.resolve();
            }
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function assignTest(userId, testId) {
    let testRef = null;
    return Test.findById(testId)
        .then(test => {
            if (test) {
                testRef = test;
                return User.findById(userId)
            } else {
                return Promise.reject('Test not found');
            }
        })
        .then(user => {
            if (!user) return Promise.reject('User not found');
            if (!user.assignedTests) user.assignedTests = [];

            user.assignedTests.push(testRef._id);
            return user.save();
        })
        .then(user => {
            return User.findById(user._id).populate('assignedTests');
        })
        .then(user => {
            return Promise.resolve(user);
        })
        .catch(error => {
            return Promise.reject(error);
        })
}

function unassignTest(userId, testId) {
    let testRef = null;
    return Test.findById(testId)
        .then(test => {
            if (test) {
                testRef = test;
                return User.findById(userId);
            } else {
                return Promise.reject('Test not found');
            }
        })
        .then(user => {
            if (!user) return Promise.reject('User not found');
            if (!user.assignedTests) {
                return Promise.reject('User has no assigned tests to unassign');
            }

            const assignIndex = user.assignedTests.indexOf(ObjectId(testId));
            if (assignIndex === -1) {
                return Promise.reject('Test not found in user assigned tests');
            }
            user.assignedTests.splice(assignIndex, 1);
            return user.save();
        })
        .then(user => {
            return User.findById(user._id).populate('assignedTests');
        })
        .then(user => {
            return Promise.resolve(user);
        })
        .catch(error => {
            return Promise.reject(error);
        })
}

function create(userProfile) {
    return User.findOne({ email: userProfile.email })
        .exec()
        .then(user => {
            if (user) {
                return Promise.reject('Email ' + userProfile.email + ' is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        const user = _.omit(userProfile, 'password');
        user.hash = bcrypt.hashSync(userProfile.password, 10);

        const userDocument = new User(user).save()
            .catch(err => {
                return Promise.reject(err.name + ': ' + err.message);
            })
    }
}

function update(userProfile) {
    return User.findById(userProfile._id)
        .exec()
        .then(user => {
            if (!user) {
                return Promise.reject('no such user');
            }
            if (userProfile.email && user.email !== userProfile.email) {
                return User.findOne({ email: userProfile.email}).exec();
            }
        })
        .then(user => {
            if (user) {
                return Promise.reject('Email ' + req.body.email + ' is already taken');
            } else {
                return updateUser();
            }
        });

    function updateUser() {
        let set = {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            imageUrl: userProfile.imageUrl,
            birthDate: userProfile.birthDate
        };
        set = _.pickBy(set);

        if (userProfile.password) {
            set.hash = bcrypt.hashSync(userProfile.password, 10);
        }

        return User.findById(userProfile._id)
            .exec()
            .then(user => {
                Object.assign(user, set);
                return user.save();
            })
            .then(user => {
                return Promise.resolve({
                    _id: user._id,
                    email: user.email,
                    imageUrl: user.imageUrl,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthDate: user.birthDate,
                    permissions: user.permissions
                });
            })
            .catch(err => {
                return Promise.reject(err.name + ': ' + err.message);
            })
    }
}

function _delete() {
    return User.remove({ _id: _id})
        .then(() => {
            return Promise.resolve();
        })
        .catch(() => {
            return Promise.reject();
        });
}

function completeTest(result, shareResult) {
    return resultService.create(result, shareResult)
        .then(createdResult => {
            return Result.findById(createdResult._id)
                .populate('user')
                .populate('test')
                .exec()
                .then(result => {
                    //check if not one-time-test without a user
                    if (result.user) {
                        if (!result.user.completedTests) {
                            result.user.completedTests = [];
                        }
                        result.user.completedTests.push(result.test._id);
                        result.user.save();
                    }
                    return result;
                })
        })
        .then(result => {
            return Promise.resolve(result);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        });
}

function socialLogin(socialUser) {
    return SocialCredentials.findOne({uid: socialUser.uid})
        .then(social => {
            if (social) {
                return User.findOne({socials: social._id});
            } else {
                var newSocialCredentials = new SocialCredentials(socialUser);
                return newSocialCredentials
                    .save()
                    .then(social => {
                        var newUser = new User(socialUser);
                        newUser.firstName = socialUser.name;
                        newUser.lastName = '';
                        newUser.imageUrl = socialUser.image;
                        newUser.permissions = [];
                        newUser.socials = [];
                        newUser.socials.push(social);
                        return newUser.save();
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    })
            }
        })
        .then(user => {
            var token = jwt.sign({ sub: user._id }, config.secret);
            return Promise.resolve({user: user, token: token});
        })
        .catch(err => {
            return Promise.reject(err);
        });
}