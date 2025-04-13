const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Please add question text']
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 4;
            },
            message: 'There must be exactly 4 options'
        }
    },
    correctAnswer: {
        type: Number,
        required: [true, 'Please specify correct answer index (0-3)'],
        min: 0,
        max: 3
    },
    explanation: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    chapter: {
        type: String,
        required: [true, 'Please add a chapter']
    },
    marks: {
        type: Number,
        default: 1
    },
    isPreviousYear: {
        type: Boolean,
        default: false
    },
    year: {
        type: Number,
        required: function() {
            return this.isPreviousYear;
        }
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', QuestionSchema);