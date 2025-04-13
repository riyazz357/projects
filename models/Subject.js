const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add subject name'],
        unique: true,
        trim: true,
        enum: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Engineering Aptitude']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    overview: {
        type: String,
        required: [true, 'Please add an overview']
    },
    preparationTips: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);