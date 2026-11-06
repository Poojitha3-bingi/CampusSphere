import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

function generateToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2d',
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = generateToken(admin._id);
  res.json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
}

export async function getProfile(req, res) {
  res.json({
    admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email },
  });
}
