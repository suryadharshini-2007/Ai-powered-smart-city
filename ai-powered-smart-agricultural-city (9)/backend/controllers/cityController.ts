import { Request, Response } from 'express';
import { CityConfigModel } from '../models/CityConfig';

export const cityController = {
  async getMetrics(req: Request, res: Response) {
    try {
      const data = await CityConfigModel.get();
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async updateMetrics(req: Request, res: Response) {
    try {
      const updated = await CityConfigModel.update(req.body);
      return res.json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async saveSetup(req: Request, res: Response) {
    try {
      const { name, focusZones, targetYieldTons, solarCapacityKw } = req.body;
      const updated = await CityConfigModel.update({
        cityName: name,
        focusZones,
        dailyCropYieldKg: targetYieldTons,
        solarGenerationKw: solarCapacityKw,
      });
      return res.json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};
