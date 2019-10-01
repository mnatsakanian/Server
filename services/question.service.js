const models = require('../models');
const Question = models.Question;

const service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

module.exports = service;

function getAll() {
    return Question.find({})
        .populate('tags')
        .exec()
        .then(questions => {
            return Promise.resolve(questions);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function getById(_id) {
    return Question.findById(_id)
        .populate('tags')
        .exec()
        .then(question => {
            if (question) {
                return Promise.resolve(question);
            } else {
                return Promise.reject('Question not found');
            }
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function create(question) {
    if (!question ||
        !question.options.length ||
        !question.correctAnswers.length) {
        return Promise.reject('Wrong parameters for creating question');
    }

    return new Question (question)
        .save()
        .then(newQuestion => {
            return Promise.resolve(newQuestion);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function update(_id, newQuestion) {
    return Question.findByIdAndUpdate(_id, newQuestion, {new: true})
        .populate('tags')
        .exec()
        .then(question => {
            return Promise.resolve(question)
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function _delete(_id) {
    return Question.remove({ _id: _id})
        .then(() => {
            return Promise.resolve();
        })
        .catch(() => {
            return Promise.reject();
        });
}
