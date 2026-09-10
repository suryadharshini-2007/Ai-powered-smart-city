import { seedZones } from '../data/mockSeedData';

export interface IZone {
  id: string;
  name: string;
  tagline: string;
  category: string;
  color: string;
  route: string;
  status: 'optimal' | 'warning' | 'critical' | 'calibrating';
  efficiency: number;
  activeSensors: number;
  powerConsumptionKw: number;
  waterUsageLpm: number;
  aiOptimizationScore: number;
  description: string;
  coordinates: [number, number, number];
}

const zonesStore = new Map<string, IZone>();
seedZones.forEach(z => zonesStore.set(z.id, z as IZone));

export const ZoneModel = {
  async findAll(): Promise<IZone[]> {
    return Array.from(zonesStore.values());
  },

  async findById(id: string): Promise<IZone | null> {
    return zonesStore.get(id) || null;
  },

  async updateStatus(id: string, status: IZone['status'], efficiency?: number): Promise<IZone | null> {
    const existing = zonesStore.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      status,
      efficiency: efficiency !== undefined ? efficiency : existing.efficiency,
    };
    zonesStore.set(id, updated);
    return updated;
  },
};
