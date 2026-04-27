import express from 'express';
import {
  getAllUsers,
  getInactiveUsers,
  deleteUser,
  toggleUserStatus,
  getDashboardStats,
  createUser,
  updateUser
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// Routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/inactive', getInactiveUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/dashboard/stats', getDashboardStats);

export default router;
