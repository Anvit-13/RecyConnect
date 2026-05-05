import express from 'express';
import { body } from 'express-validator';
import {
  createPickupRequest,
  getUserPickupRequests,
  getPickupRequestById,
  getAllPickupRequests,
  updatePickupStatus,
  deletePickupRequest
} from '../controllers/pickupController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Validation
const createPickupValidation = [
  body('devices').isArray({ min: 1 }).withMessage('At least one device is required'),
  body('devices.*.deviceType').notEmpty().withMessage('Device type is required'),
  body('devices.*.brand').notEmpty().withMessage('Brand is required'),
  body('devices.*.model').notEmpty().withMessage('Model is required'),
  body('devices.*.condition').isIn(['working', 'partially-working', 'not-working', 'broken']).withMessage('Invalid condition'),
  body('devices.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('address').notEmpty().withMessage('Address is required'),
  body('pickupDate').isDate().withMessage('Valid pickup date is required')
];

// Routes
router.post('/', authenticate, upload.array('images', 10), createPickupValidation, createPickupRequest);
router.get('/my-requests', authenticate, getUserPickupRequests);
router.get('/all', authenticate, authorize('admin', 'collector', 'recycler'), getAllPickupRequests);
router.get('/:id', authenticate, getPickupRequestById);
router.put('/:id', authenticate, authorize('admin', 'collector', 'recycler'), updatePickupStatus);
router.delete('/:id', authenticate, deletePickupRequest);

export default router;
