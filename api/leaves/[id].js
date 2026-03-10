import { connectDB } from '../../../lib/db.js';
import { Leave } from '../../../models/Leave.js';
import { requireEmployer } from '../../../middleware/auth.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Only employers can approve/reject leave
    const authResult = await requireEmployer(req);
    if (authResult.error) {
      return res.status(authResult.status).json({ message: authResult.error });
    }

    const { id } = req.query;
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { status: rawStatus, rejectionReason } = body || {};

    // Normalize status for lenient client payloads (e.g., 'approve', 'APPROVED')
    const status = typeof rawStatus === 'string' ? rawStatus.trim().toLowerCase() : '';
    const normalizedStatus = status === 'approved' || status === 'approve' ? 'Approved' : status === 'rejected' || status === 'reject' ? 'Rejected' : null;

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    // Validate rejection reason is provided when rejecting
    if (normalizedStatus === 'Rejected' && (!rejectionReason || rejectionReason.trim().length < 5)) {
      return res.status(400).json({ message: 'Rejection reason must be at least 5 characters' });
    }

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'This leave has already been processed' });
    }

    leave.status = normalizedStatus;
    if (normalizedStatus === 'Rejected') {
      leave.rejectionReason = rejectionReason;
    }
    await leave.save();

    const updatedLeave = await Leave.findById(leave._id).populate('employeeId', 'name email');

    res.status(200).json({
      message: `Leave ${normalizedStatus.toLowerCase()} successfully`,
      leave: updatedLeave,
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ message: 'Server error while updating leave status' });
  }
}
