const config = require('../config.json');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const models = require('../models');
const User = models.User;
const Test = models.Test;

const service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;
service.getAvailable = getAvailable;

module.exports = service;


function getAll() {
    return Test.find({})
        .populate('tags')
        .exec()
        .then(tests => {
            return Promise.resolve(tests);
        })
        .catch(err => {
            console.error(err);
        }) ;
}

function getAvailable(userId) {
    let availableTests = [];
    return Test.find({ accessType: 'public' })
        .populate('tags')
        .exec()
        .then(tests => {
            availableTests = availableTests.concat(tests);
            return User.findById(userId).populate('assignedTests').populate('tags');
        })
        .then(user => {
            if (!user.assignedTests) {
                user.assignedTests = [];
            }

            for (let i=0; i<user.assignedTests.length; i++) {
                for (let j=0; j<availableTests.length; j++) {
                    if (availableTests[j]._id.toString() === user.assignedTests[i]._id.toString()) {
                        availableTests.splice(j, 1);
                        break;
                    }
                }
            }

            availableTests = availableTests.concat(user.assignedTests);
            return Promise.resolve(availableTests);
        })
        .catch(error => Promise.reject(error));
}

function getBriefById(_id) {
    return service.getById(_id)
        .then(test => {
            let briefTest = _.omit(test, "questions");
            return Promise.resolve(briefTest);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function getById(_id) {
    return Test.findById(_id)
        .populate('tags')
        .populate('questions')
        .exec()
        .then(test => {
            if (!test) {
                return Promise.reject('Test not found');
            }
            return Promise.resolve(test.toObject());
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function create(test) {
    let questions = [];
    if (!test.questions && !Array.isArray(test.questions)) {
        return Promise.reject(new Error("Not specified questions for test"));
    }

    if (!test.description) {
        return Promise.reject("Not specified description for test");
    }

    if (!test.accessType) {
        return Promise.reject("Not specified access type for test");
    }

    for (let i = 0; i < test.questions.length; i++) {
        questions.push(ObjectId(test.questions[i]));
    }

    return new Test({
        topic: test.topic,
        description: test.description,
        accessType: test.accessType,
        tags: test.tags,
        time: test.time,
        questions: questions,
    })
        .save()
        .then(() => {
            return Promise.resolve();
        })
        .catch(error => {
            console.error(error);
        });
}

function _delete(_id) {
    return Test.findByIdAndRemove(_id)
        .then(() => {
            return Promise.resolve();
        })
        .catch(() => {
            return Promise.reject();
        });
}

function update(_id, updatedTest) {
    return Test.findByIdAndUpdate(_id, updatedTest)
        .exec()
        .then((test) => {
            return Promise.resolve();
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        });
}