import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as recyclingController from '../controllers/recyclingController.js';

const router = express.Router();

// All recycling routes require authentication
router.use(authenticate);

// Available to both admins and recyclers
router.use(authorize('admin', 'recycler'));

router.get('/dashboard/stats', recyclingController.getRecyclerDashboardStats);
router.get('/records', recyclingController.getRecyclingRecords);
router.get('/materials', recyclingController.getRecoveryMaterials);

// Only recyclers can create records
router.post('/records', authorize('recycler'), recyclingController.createRecyclingRecord);

export default router;
