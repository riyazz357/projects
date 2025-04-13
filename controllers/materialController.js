const Material = require('../models/Material');
const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
// const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');

// @desc    Get all materials
// @route   GET /api/materials
// @route   GET /api/subjects/:subjectId/materials
// @access  Public
exports.getMaterials = asyncHandler(async (req, res, next) => {
    if (req.params.subjectId) {
        const materials = await Material.find({ subject: req.params.subjectId })
            .populate('subject', 'name')
            .populate('uploadedBy', 'name');

        return res.status(200).json({
            success: true,
            count: materials.length,
            data: materials
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Public
exports.getMaterial = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id)
        .populate('subject', 'name description')
        .populate('uploadedBy', 'name');

    if (!material) {
        return next(
            new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: material
    });
});

// @desc    Create new material
// @route   POST /api/materials
// @access  Private
exports.createMaterial = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.uploadedBy = req.admin.id;

    // Check if subject exists
    const subject = await Subject.findById(req.body.subject);
    if (!subject) {
        return next(
            new ErrorResponse(`Subject not found with id of ${req.body.subject}`, 404)
        );
    }

    const material = await Material.create(req.body);

    res.status(201).json({
        success: true,
        data: material
    });
});

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private
exports.updateMaterial = asyncHandler(async (req, res, next) => {
    let material = await Material.findById(req.params.id);

    if (!material) {
        return next(
            new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure admin is material owner or superadmin
    if (material.uploadedBy.toString() !== req.admin.id && req.admin.role !== 'superadmin') {
        return next(
            new ErrorResponse(`Admin ${req.admin.id} is not authorized to update this material`, 401)
        );
    }

    material = await Material.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: material
    });
});

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
exports.deleteMaterial = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(
            new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure admin is material owner or superadmin
    if (material.uploadedBy.toString() !== req.admin.id && req.admin.role !== 'superadmin') {
        return next(
            new ErrorResponse(`Admin ${req.admin.id} is not authorized to delete this material`, 401)
        );
    }

    await material.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Upload file for material
// @route   PUT /api/materials/:id/file
// @access  Private
exports.uploadMaterialFile = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(
            new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure admin is material owner or superadmin
    if (material.uploadedBy.toString() !== req.admin.id && req.admin.role !== 'superadmin') {
        return next(
            new ErrorResponse(`Admin ${req.admin.id} is not authorized to update this material`, 401)
        );
    }

    if (!req.file) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    // Check file type
    const fileTypes = ['pdf', 'video', 'document', 'image'];
    const fileType = req.file.mimetype.split('/')[0];
    if (!fileTypes.includes(fileType === 'application' ? 'pdf' : fileType)) {
        return next(new ErrorResponse(`Please upload a valid file type (pdf, video, document, image)`, 400));
    }

    // Update material with file info
    material.fileUrl = `/uploads/${req.file.filename}`;
    material.fileType = fileType === 'application' ? 'pdf' : fileType;
    await material.save();

    res.status(200).json({
        success: true,
        data: material
    });
});