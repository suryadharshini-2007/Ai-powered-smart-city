import { Router } from 'express';
import { sensorController } from '../controllers/sensorController';

export const sensorRouter = Router();

sensorRouter.get('/', sensorController.getSensors);
sensorRouter.post('/:id/reading', sensorController.recordReading);
