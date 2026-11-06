import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Department from '../models/Department.js';

export async function getStats(req, res) {
  const [totalStudents, totalStaff, totalDepartments, recentStudents, recentStaff] =
    await Promise.all([
      Student.countDocuments(),
      Staff.countDocuments(),
      Department.countDocuments(),
      Student.find().populate('department', 'name code').sort({ createdAt: -1 }).limit(5),
      Staff.find().populate('department', 'name code').sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    totalStudents,
    totalStaff,
    totalDepartments,
    recentRegistrations: {
      students: recentStudents,
      staff: recentStaff,
    },
  });
}
