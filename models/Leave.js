import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Sick Leave', 'Casual Leave', 'Vacation'],
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [5, 'Reason must be at least 5 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
      minlength: [5, 'Rejection reason must be at least 5 characters'],
    },
  },
  { timestamps: true }
);

// Validate endDate is not before startDate
leaveSchema.pre('save', function (next) {
  if (this.endDate < this.startDate) {
    const err = new Error('End date cannot be before start date');
    return next(err);
  }
  next();
});

export const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
