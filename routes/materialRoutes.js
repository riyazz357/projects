const express = require('express');
const {
    getMaterials,
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    uploadMaterialFile
} = require('../controllers/materialController');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');

router
    .route('/')
    .get(getMaterials)
    .post(protect, createMaterial);

router
    .route('/:id')
    .get(getMaterial)
    .put(protect, updateMaterial)
    .delete(protect, deleteMaterial);

router
    .route('/:id/file')
    .put(protect, upload.single('file'), uploadMaterialFile);

module.exports = router;