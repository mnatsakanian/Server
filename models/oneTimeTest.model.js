const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const OneTimeTestSchema = new Schema({
    test: {
        type: ObjectId,
        ref: 'Test',
        required: [true, 'Cant have one time test without test reference']
    },
    result: { type: ObjectId, ref: 'Result'},
    status: {
        type: String,
        required: true
    },
    expireDate: {
        type: Number,
        required: true
    },
    assignee: String,
});

const OneTimeTest = mongoose.model('OneTimeTest', OneTimeTestSchema);
module.exports = OneTimeTest;