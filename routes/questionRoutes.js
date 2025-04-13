const express = require('express');
const {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(getQuestions)
    .post(protect, createQuestion);

router
    .route('/:id')
    .get(getQuestion)
    .put(protect, updateQuestion)
    .delete(protect, deleteQuestion);

module.exports = router;