const models = require('../models');
const OneTimeTest = models.OneTimeTest;
const Test = models.Test;
const service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;
service.updateStatus = updateStatus;
service.setResult = setResult;

module.exports = service;

function getAll() {
    return OneTimeTest.find({})
        .populate('test')
        .populate({
            path: 'test',
            populate: {
                path: 'tags',
                model: 'Tag'
            }
        })
        .exec()
        .then(oneTimeTests => {
            for (var i = 0; i < oneTimeTests.length; i++) {
                if (checkIfExpired(oneTimeTests[i])) {
                    setExpiredStatus(oneTimeTests[i]);
                }
            }
            return Promise.resolve(oneTimeTests);
        });
}

function getById(_id) {
    return OneTimeTest.findById(_id)
        .populate('test')
        .exec()
        .then(oneTimeTest => {
            if (!oneTimeTest) {
                return Promise.reject('One time test not found');
            }
            if (checkIfExpired(oneTimeTest)) {
                setExpiredStatus(oneTimeTest);
            }
            return Promise.resolve(oneTimeTest);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        })
}

function create(oneTimeTest) {
    return new OneTimeTest(oneTimeTest)
        .save()
        .then((oneTimeTest) => {
            return Promise.resolve(oneTimeTest);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        });
}

function update(_id, oneTimeTest) {
    return OneTimeTest.findByIdAndUpdate(_id, oneTimeTest, {new: true})
        .populate('test')
        .exec()
        .then((oneTimeTest) => {
            if(!oneTimeTest) {
                return Promise.reject('No such one time test');
            }
            if (checkIfExpired(oneTimeTest)) {
                setExpiredStatus(oneTimeTest);
            }
            return Promise.resolve(oneTimeTest);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        });
}

function updateStatus(_id, status) {
    return OneTimeTest.findById(_id)
        .exec()
        .then((oneTimeTest) => {
            if (!oneTimeTest) {
                return Promise.reject('No such one time test');
            }
            if (checkIfExpired(oneTimeTest)) {
                setExpiredStatus(oneTimeTest);
            }
            oneTimeTest.status = status;
            return oneTimeTest.save();
        })
        .then((oneTimeTest) => {
            return Promise.resolve(oneTimeTest);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        });
}

function setResult(_id, result) {
    return OneTimeTest.findById(_id)
        .exec()
        .then((oneTimeTest) => {
            if (!oneTimeTest) {
                return Promise.reject('No such one time test');
            }
            if (checkIfExpired(oneTimeTest)) {
                setExpiredStatus(oneTimeTest);
                return Promise.reject('cant set result on expired test');
            }
            oneTimeTest.result = result;
            return oneTimeTest.save();
        })
        .then((oneTimeTest) => {
            return Promise.resolve(oneTimeTest);
        })
        .catch(err => {
            return Promise.reject(err.name + ': ' + err.message);
        });
}

function _delete(_id) {
    return OneTimeTest.findByIdAndRemove({ _id: _id})
        .then(() => {
            return Promise.resolve();
        })
        .catch(() => {
            return Promise.reject();
        });
}

function checkIfExpired(oneTimeTest) {
    return Date.now() > oneTimeTest.expireDate;
}

function setExpiredStatus(oneTimeTest) {
    oneTimeTest.status = 'expired';
    oneTimeTest.save();
}