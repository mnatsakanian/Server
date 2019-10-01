const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const QuestionSchema = new Schema({
    question: String,
    options: [String],
    type: {
        type: String,
        enum: ['choise', 'multichoise', 'code']
    },
    correctAnswers: [ Number ],
    tags: [
        { type: ObjectId, ref: 'Tag' }
    ]
});

QuestionSchema.pre("save", function(next) {
    this.type = this.correctAnswers.length === 1 ? 'choise' : 'multichoise';
    next();
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;