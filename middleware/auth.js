import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Not authorized, no token provided', status: 401 };
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    return { user, error: null };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function requireAuth(req) {
  const result = await verifyToken(req);
  if (result.error) {
    return { error: result.error, status: result.status };
  }
  return { user: result.user, error: null };
}

export async function requireEmployer(req) {
  const result = await verifyToken(req);
  if (result.error) {
    return { error: result.error, status: result.status };
  }
  if (result.user.role !== 'employer') {
    return { error: 'Access denied: Employers only', status: 403 };
  }
  return { user: result.user, error: null };
}

export async function requireEmployee(req) {
  const result = await verifyToken(req);
  if (result.error) {
    return { error: result.error, status: result.status };
  }
  if (result.user.role !== 'employee') {
    return { error: 'Access denied: Employees only', status: 403 };
  }
  return { user: result.user, error: null };
}
