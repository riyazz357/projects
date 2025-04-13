const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    classLevel: {
        type: String,
        required: true,
        enum: ['11', '12', 'Both']
    },
    chapter: {
        type: String,
        required: [true, 'Please add a chapter']
    },
    fileUrl: {
        type: String,
        required: [true, 'Please upload a file']
    },
    fileType: {
        type: String,
        required: true,
        enum: ['pdf', 'video', 'document', 'image']
    },
    isPremium: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('Material', MaterialSchema);