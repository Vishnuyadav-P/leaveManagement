const Leave = require('../models/Leave');

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
// @access  Private (Employee only)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    if (start < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    const leave = await Leave.create({
      employeeId: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
    });

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while applying for leave' });
  }
};

// @desc    Get employee's own leaves
// @route   GET /api/leaves/my
// @access  Private (Employee only)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ leaves });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching leaves' });
  }
};

// @desc    Get all leave requests (Employer)
// @route   GET /api/leaves
// @access  Private (Employer only)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching all leaves' });
  }
};

// @desc    Approve or reject a leave request (Employer)
// @route   PATCH /api/leaves/:id
// @access  Private (Employer only)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    // Validate rejection reason is provided when rejecting
    if (status === 'Rejected' && (!rejectionReason || rejectionReason.trim().length < 5)) {
      return res.status(400).json({ message: 'Rejection reason must be at least 5 characters' });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'This leave has already been processed' });
    }

    leave.status = status;
    if (status === 'Rejected') {
      leave.rejectionReason = rejectionReason;
    }
    await leave.save();

    const updatedLeave = await Leave.findById(leave._id).populate('employeeId', 'name email');

    res.status(200).json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating leave status' });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
