import { Request, Response } from 'express';
import { SensorReadingModel } from '../models/SensorReading';

export const sensorController = {
  async getSensors(req: Request, res: Response) {
    try {
      const zoneId = req.query.zone as string | undefined;
      const data = await SensorReadingModel.find(zoneId ? { zoneId } : undefined);
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async recordReading(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { value } = req.body;
      const updated = await SensorReadingModel.appendReading(id, Number(value));
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Sensor node not found' });
      }
      return res.json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};
