import { Router } from 'express';
import { cityController } from '../controllers/cityController';

export const cityRouter = Router();

cityRouter.get('/metrics', cityController.getMetrics);
cityRouter.patch('/metrics', cityController.updateMetrics);
cityRouter.post('/setup', cityController.saveSetup);
