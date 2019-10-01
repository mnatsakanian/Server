const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    title: { type: String, required: true }
});

const Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;