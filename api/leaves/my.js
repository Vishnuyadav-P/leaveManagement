import { connectDB } from '../../lib/db.js';
import { Leave } from '../../models/Leave.js';
import { requireAuth } from '../../middleware/auth.js';

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

    const authResult = await requireAuth(req);
    if (authResult.error) {
      return res.status(authResult.status).json({ message: authResult.error });
    }

    const user = authResult.user;

    const leaves = await Leave.find({ employeeId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ message: 'Server error while fetching leaves' });
  }
}
