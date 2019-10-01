const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TestSchema = new Schema({
    topic: String,
    description: String,
    accessType: {
        type: String,
        enum: ['public', 'private']
    },
    questions: {
        type: [
            { type: ObjectId, ref: 'Question' }
            ],
        required: [true, 'Not specified questions for request']
    },
    tags: [
        { type: ObjectId, ref: 'Tag' }
    ],
    time: {
        type: Number,
        default: 60*30*1000
    }
});

TestSchema.pre("save", function(next) {
    if (!this.tags) {
        this.tags = [];
    }
    next();
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;