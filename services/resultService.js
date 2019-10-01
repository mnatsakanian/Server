const config = require('../config.json');

const models = require('../models');
const User = models.User;
const Result = models.Results;
const Test = models.Test;

const service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.toggleShareResult = toggleShareResult;

module.exports = service;

function getAll(userId) {
    return Result.find({ user: userId })
        .populate('test')
        .populate('user')
        .exec()
        .then(results => {
            return Promise.resolve(results);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function getById(resultId) {
    return Result.findById(resultId)
        .populate('test')
        .populate('user')
        .exec()
        .then(result => {
            return Promise.resolve(result);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function create(result, share) {
    return Test.findById(result.test._id).populate('questions')
        .exec()
        .then((test) => {
            if (!test) {
                return Promise.reject('No test with given id exists');
            }
            if (result.user) {
                result.user = result.user._id;
            }
            result.test = result.test._id;

            calculateScores(result, test);
            result.shared = share;

            return new Result(result).save();
        })
        .then((result) => {
            return result;
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function calculateScores(result, test) {
    if (!result.questionsNumber) {
        result.questionsNumber = test.questions.length;
    }
    for (let i=0; i < result.questionsNumber; i++) {
        if (compare(test.questions[i].correctAnswers, result.userAnswers[i])) {
            result.correctAnswers++;
        }
    }
    // in future cases if needed return calculated score
    return (result.correctAnswers * 100.0 / result.questionsNumber).toFixed(2);

    function compare(correct, answers) {
        if (answers.length !== correct.length ) return false;
        if (answers.length > 1) {
            answers = answers.sort();
            correct = correct.sort();
        }
        for (let i=0; i < answers.length; i++) {
            if (answers[i] !== correct[i]) return false;
        }
        return true;
    }
}

/*
    Makes result shared (can be viewed by anybody via url)
    can be done only by owner or admin
 */

function toggleShareResult(result, userId) {
    var resultRef;
    return Result.findById(result._id)
        .populate('user')
        .exec()
        .then((result) => {
            if (!result) {
                return Promise.reject('cant make non-existing result shared');
            }
            resultRef = result;
            return User.findById(result.user._id).exec();
        })
        .then((user) => {
            if (user._id.toString() !== userId.toString()) {
                return Promise.reject('you are not allowed setting this result shared');
            }
            resultRef.shared = !resultRef.shared;
            return resultRef.save();
        })
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function _cleanup() {
    User.find({}).exec()
        .then((users) => {
            for(var i=0; i<users.length; i++) {
                users[i].completedTests = [];
            }
            users.save();
        })
    Result.remove({}).then(
        res => {
            return Promise.resolve();
        }
    );
}