const models = require('../models');
const Tag = models.Tag;

const service = {};

service.getAll = getAll;
service.delete = _delete;
service.update = update;
service.create = create;

module.exports = service;

function getAll() {
    return Tag.find({})
        .then(
            (tags) => {
                return Promise.resolve(tags);
            }
        )
        .catch(
            (err) => {
                return Promise.reject(err);
            }
        )
}

function create(tag) {
    const newTag = new Tag(tag);
    return newTag.save()
        .then(
            (tag) => {
                return Promise.resolve(tag);
            }
        )
        .catch(
            (err) => {
                return Promise.reject(err);
            }
        )
}

function update(tag) {
    return Tag.findByIdAndUpdate(tag._id, tag, {new: true})
        .then(
            (tag) => {
                return Promise.resolve(tag);
            }
        )
        .catch(
            (err) => {
                return Promise.reject(err);
            }
        )
}

function _delete(tagId) {
    return Tag.findByIdAndRemove(tagId)
        .then(
            removedTag => {
                return Promise.resolve();
            }
        )
        .catch(
            err => {
                return Promise.reject(err);
            }
        )
}