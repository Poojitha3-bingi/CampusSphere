import Department from '../models/Department.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

// GET /api/departments?search=
export async function getDepartments(req, res) {
  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }
  const departments = await Department.find(filter).sort({ name: 1 });
  res.json(departments);
}

export async function getDepartment(req, res) {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }
  res.json(department);
}

export async function createDepartment(req, res) {
  const { name, code, description } = req.body;
  const department = await Department.create({ name, code, description });
  res.status(201).json(department);
}

export async function updateDepartment(req, res) {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }
  const { name, code, description } = req.body;
  department.name = name ?? department.name;
  department.code = code ?? department.code;
  department.description = description ?? department.description;
  const updated = await department.save();
  res.json(updated);
}

export async function deleteDepartment(req, res) {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }
  const [studentCount, staffCount] = await Promise.all([
    Student.countDocuments({ department: req.params.id }),
    Staff.countDocuments({ department: req.params.id }),
  ]);
  if (studentCount > 0 || staffCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete: ${studentCount} student(s) and ${staffCount} staff member(s) belong to this department. Reassign them first.`
    );
  }
  await department.deleteOne();
  res.json({ message: 'Department removed' });
}
