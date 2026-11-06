import Staff from '../models/Staff.js';

// GET /api/staff?search=&department=&page=&limit=
export async function getStaff(req, res) {
  const { search, department } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 1000, 1000);
  const skip = (page - 1) * limit;

  const filter = {};
  if (department) filter.department = department;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
    ];
  }

  const [staff, total] = await Promise.all([
    Staff.find(filter)
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Staff.countDocuments(filter),
  ]);

  res.json({ staff, total, page, pages: Math.ceil(total / limit) });
}

export async function getStaffMember(req, res) {
  const staff = await Staff.findById(req.params.id).populate('department', 'name code');
  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }
  res.json(staff);
}

export async function createStaff(req, res) {
  const { name, email, employeeId, phone, designation, department } = req.body;
  const staff = await Staff.create({ name, email, employeeId, phone, designation, department });
  await staff.populate('department', 'name code');
  res.status(201).json(staff);
}

export async function updateStaff(req, res) {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }
  const { name, email, employeeId, phone, designation, department } = req.body;
  staff.name = name ?? staff.name;
  staff.email = email ?? staff.email;
  staff.employeeId = employeeId ?? staff.employeeId;
  staff.phone = phone ?? staff.phone;
  staff.designation = designation ?? staff.designation;
  staff.department = department ?? staff.department;
  const updated = await staff.save();
  await updated.populate('department', 'name code');
  res.json(updated);
}

export async function deleteStaff(req, res) {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }
  await staff.deleteOne();
  res.json({ message: 'Staff member removed' });
}
