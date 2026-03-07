const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require('../controllers/leaveController');
const { protect, employeeOnly, employerOnly } = require('../middleware/authMiddleware');

// Employee routes
router.post('/', protect, employeeOnly, applyLeave);
router.get('/my', protect, employeeOnly, getMyLeaves);

// Employer routes
router.get('/', protect, employerOnly, getAllLeaves);
router.patch('/:id', protect, employerOnly, updateLeaveStatus);

module.exports = router;
