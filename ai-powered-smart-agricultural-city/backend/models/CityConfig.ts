import { seedCityMetrics } from '../data/mockSeedData';

export interface ICityConfig {
  cityName: string;
  status: 'online' | 'standby' | 'alert';
  population: number;
  totalAcreageHectares: number;
  solarGenerationKw: number;
  waterRecycledPercentage: number;
  dailyCropYieldKg: number;
  co2OffsetTons: number;
  autonomousVehicleUptime: number;
  wasteDivertedPercentage: number;
  systemHealthIndex: number;
  focusZones: string[];
  lastSync: string;
}

let activeCityConfig: ICityConfig = {
  ...seedCityMetrics,
  focusZones: ['agriculture', 'traffic', 'infrastructure', 'market', 'waste', 'school'],
};

export const CityConfigModel = {
  async get(): Promise<ICityConfig> {
    return { ...activeCityConfig, lastSync: new Date().toISOString() };
  },

  async update(patch: Partial<ICityConfig>): Promise<ICityConfig> {
    activeCityConfig = {
      ...activeCityConfig,
      ...patch,
      lastSync: new Date().toISOString(),
    };
    return activeCityConfig;
  },
};
