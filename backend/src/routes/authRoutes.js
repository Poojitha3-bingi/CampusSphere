import { Router } from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getProfile);

export default router;
