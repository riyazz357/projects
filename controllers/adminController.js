const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

const crypto = require('crypto');

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(admin, 200, res);
});

// @desc    Get current logged in admin
// @route   GET /api/admin/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Update admin password
// @route   PUT /api/admin/updatepassword
// @access  Private
exports.updateAdminPassword = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id).select('+password');

  // Check current password
  if (!(await admin.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  admin.password = req.body.newPassword;
  await admin.save();

  sendTokenResponse(admin, 200, res);
});

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private/Superadmin
exports.getAdmins = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single admin
// @route   GET /api/admin/:id
// @access  Private/Superadmin
exports.getAdmin = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    return next(
      new ErrorResponse(`Admin not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Create admin
// @route   POST /api/admin
// @access  Private/Superadmin
exports.createAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const admin = await Admin.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(admin, 201, res);
});

// @desc    Update admin
// @route   PUT /api/admin/:id
// @access  Private/Superadmin
exports.updateAdmin = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const admin = await Admin.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/Superadmin
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  await Admin.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};