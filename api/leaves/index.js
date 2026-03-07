import { connectDB } from '../../lib/db.js';
import { Leave } from '../../models/Leave.js';
import { requireEmployer } from '../../middleware/auth.js';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Only employers can view all leaves
    const authResult = await requireEmployer(req);
    if (authResult.error) {
      return res.status(authResult.status).json({ message: authResult.error });
    }

    const leaves = await Leave.find()
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ message: 'Server error while fetching all leaves' });
  }
}
