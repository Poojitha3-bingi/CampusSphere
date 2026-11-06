import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Department from '../models/Department.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Admin.deleteMany({}),
    Department.deleteMany({}),
    Student.deleteMany({}),
    Staff.deleteMany({}),
  ]);

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@institute.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  await Admin.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email: adminEmail,
    password: adminPassword,
  });
  console.log(`Admin created -> ${adminEmail} / ${adminPassword}`);

  // Departments
  const departments = await Department.insertMany([
    { name: 'Computer Science', code: 'CSE', description: 'Computer Science & Engineering' },
    { name: 'Electronics', code: 'ECE', description: 'Electronics & Communication Engineering' },
    { name: 'Mechanical', code: 'MECH', description: 'Mechanical Engineering' },
    { name: 'Civil', code: 'CIVIL', description: 'Civil Engineering' },
  ]);
  const cse = departments[0]._id;
  const ece = departments[1]._id;

  // Students
  await Student.insertMany([
    { name: 'Aarav Sharma', email: 'aarav@institute.edu', phone: '9876543210', rollNumber: 'CSE001', department: cse, year: '2nd' },
    { name: 'Diya Patel', email: 'diya@institute.edu', phone: '9876543211', rollNumber: 'CSE002', department: cse, year: '1st' },
    { name: 'Rohan Verma', email: 'rohan@institute.edu', phone: '9876543212', rollNumber: 'ECE001', department: ece, year: '3rd' },
    { name: 'Ananya Iyer', email: 'ananya@institute.edu', phone: '9876543213', rollNumber: 'ECE002', department: ece, year: '4th' },
  ]);

  // Staff
  await Staff.insertMany([
    { name: 'Dr. Rajesh Kumar', email: 'rajesh@institute.edu', employeeId: 'EMP001', phone: '9123456780', designation: 'Professor', department: cse },
    { name: 'Prof. Meera Nair', email: 'meera@institute.edu', employeeId: 'EMP002', phone: '9123456781', designation: 'Associate Professor', department: ece },
  ]);

  console.log('Seed complete!');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
