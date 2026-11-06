import { Router } from 'express';
import {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';
import { protect } from '../middleware/protect.js';

const router = Router();

router.route('/').get(protect, getStaff).post(protect, createStaff);
router
  .route('/:id')
  .get(protect, getStaffMember)
  .put(protect, updateStaff)
  .delete(protect, deleteStaff);

export default router;
