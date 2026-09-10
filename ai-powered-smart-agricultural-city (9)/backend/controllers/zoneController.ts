import { Request, Response } from 'express';
import { ZoneModel } from '../models/ZoneData';

export const zoneController = {
  async getAllZones(req: Request, res: Response) {
    try {
      const zones = await ZoneModel.findAll();
      return res.json({ success: true, data: zones });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async getZoneById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const zone = await ZoneModel.findById(id);
      if (!zone) {
        return res.status(404).json({ success: false, error: 'Zone not found' });
      }
      return res.json({ success: true, data: zone });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async updateZoneStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, efficiency } = req.body;
      const updated = await ZoneModel.updateStatus(id, status, efficiency);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Zone not found' });
      }
      return res.json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};
