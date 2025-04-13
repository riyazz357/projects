const express = require('express');
const router = express.Router();
const {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  adminLogin,
  getMe,
  updateAdminPassword
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', adminLogin);

// Protected routes (require authentication)
router.use(protect);

router.get('/me', getMe);
router.put('/updatepassword', updateAdminPassword);

// Superadmin-only routes
router.use(authorize('superadmin'));

router.route('/')
  .get(getAdmins)
  .post(createAdmin);

router.route('/:id')
  .get(getAdmin)
  .put(updateAdmin)
  .delete(deleteAdmin);

module.exports = router;