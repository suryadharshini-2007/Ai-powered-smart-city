import { Router } from 'express';
import { zoneController } from '../controllers/zoneController';

export const zoneRouter = Router();

zoneRouter.get('/', zoneController.getAllZones);
zoneRouter.get('/:id', zoneController.getZoneById);
zoneRouter.patch('/:id/status', zoneController.updateZoneStatus);
