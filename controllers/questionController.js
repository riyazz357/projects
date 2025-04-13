const Question = require('../models/Question');
const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all questions
// @route   GET /api/questions
// @route   GET /api/subjects/:subjectId/questions
// @access  Public
exports.getQuestions = asyncHandler(async (req, res, next) => {
    if (req.params.subjectId) {
        const questions = await Question.find({ subject: req.params.subjectId })
            .populate('subject', 'name')
            .populate('uploadedBy', 'name');

        return res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
        .populate('subject', 'name')
        .populate('uploadedBy', 'name');

    if (!question) {
        return next(
            new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.uploadedBy = req.admin.id;

    // Check if subject exists
    const subject = await Subject.findById(req.body.subject);
    if (!subject) {
        return next(
            new ErrorResponse(`Subject not found with id of ${req.body.subject}`, 404)
        );
    }

    const question = await Question.create(req.body);

    res.status(201).json({
        success: true,
        data: question
    });
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure admin is question owner or superadmin
    if (question.uploadedBy.toString() !== req.admin.id && req.admin.role !== 'superadmin') {
        return next(
            new ErrorResponse(`Admin ${req.admin.id} is not authorized to update this question`, 401)
        );
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure admin is question owner or superadmin
    if (question.uploadedBy.toString() !== req.admin.id && req.admin.role !== 'superadmin') {
        return next(
            new ErrorResponse(`Admin ${req.admin.id} is not authorized to delete this question`, 401)
        );
    }

    await question.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});