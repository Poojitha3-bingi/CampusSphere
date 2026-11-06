import { Router } from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/protect.js';

const router = Router();

router.route('/').get(protect, getDepartments).post(protect, createDepartment);
router
  .route('/:id')
  .get(protect, getDepartment)
  .put(protect, updateDepartment)
  .delete(protect, deleteDepartment);

export default router;
