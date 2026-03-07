import { connectDB } from '../../lib/db.js';
import { Leave } from '../../models/Leave.js';
import { requireEmployee } from '../../middleware/auth.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Only employees can apply for leave
    const authResult = await requireEmployee(req);
    if (authResult.error) {
      return res.status(authResult.status).json({ message: authResult.error });
    }

    const user = authResult.user;
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
      employeeId: user._id,
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
    console.error('Apply leave error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({ message: messages });
    }

    res.status(500).json({ message: 'Server error while applying for leave' });
  }
}
