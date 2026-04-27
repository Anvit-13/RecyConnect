import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as collectorController from '../controllers/collectorController.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin', 'collector'));

router.get('/dashboard/stats', collectorController.getCollectorDashboardStats);
router.get('/routes', collectorController.getRoutes);
router.get('/collections', collectorController.getCollections);
router.get('/today-stops', collectorController.getTodayStops);
router.get('/recyclers', collectorController.getRecyclers);
router.patch('/routes/:id/status', collectorController.updateRouteStatus);


export default router;
