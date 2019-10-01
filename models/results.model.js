const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ResultsSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    test: { type: ObjectId, ref: 'Test' },
    testTopic: String,
    userAnswers: [{ question: ObjectId, answers: [Number] }],
    correctAnswers: Number,
    questionsNumber: Number,
    defaultTime: Number,
    startTime: Number,
    endTime: Number,
    shared: Boolean
});

const Results = mongoose.model('Results', ResultsSchema);
module.exports = Results;