import Student from '../models/Student.js';

// GET /api/students?search=&department=&year=&page=&limit=
export async function getStudents(req, res) {
  const { search, department, year } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 1000, 1000);
  const skip = (page - 1) * limit;

  const filter = {};
  if (department) filter.department = department;
  if (year) filter.year = year;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  res.json({ students, total, page, pages: Math.ceil(total / limit) });
}

export async function getStudent(req, res) {
  const student = await Student.findById(req.params.id).populate('department', 'name code');
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  res.json(student);
}

export async function createStudent(req, res) {
  const { name, email, phone, rollNumber, department, year } = req.body;
  const student = await Student.create({ name, email, phone, rollNumber, department, year });
  await student.populate('department', 'name code');
  res.status(201).json(student);
}

export async function updateStudent(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  const { name, email, phone, rollNumber, department, year } = req.body;
  student.name = name ?? student.name;
  student.email = email ?? student.email;
  student.phone = phone ?? student.phone;
  student.rollNumber = rollNumber ?? student.rollNumber;
  student.department = department ?? student.department;
  student.year = year ?? student.year;
  const updated = await student.save();
  await updated.populate('department', 'name code');
  res.json(updated);
}

export async function deleteStudent(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  await student.deleteOne();
  res.json({ message: 'Student removed' });
}
