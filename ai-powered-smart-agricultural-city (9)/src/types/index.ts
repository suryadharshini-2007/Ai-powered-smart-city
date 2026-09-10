export type ZoneId =
  | 'agriculture'
  | 'traffic'
  | 'school'
  | 'market'
  | 'waste'
  | 'infrastructure';

export interface ZoneSummary {
  id: ZoneId;
  name: string;
  tagline: string;
  category: string;
  color: string;
  route: string;
  status: 'optimal' | 'warning' | 'critical' | 'calibrating';
  efficiency: number; // percentage 0-100
  activeSensors: number;
  powerConsumptionKw: number;
  waterUsageLpm: number;
  aiOptimizationScore: number;
  description: string;
  coordinates: [number, number, number]; // 3D coordinates in master city
}

export interface SensorReading {
  id: string;
  name: string;
  zoneId: ZoneId;
  type: 'soil_moisture' | 'temperature' | 'air_quality' | 'traffic_flow' | 'power_grid' | 'water_level' | 'nutrient_ec';
  value: number;
  unit: string;
  targetRange: [number, number];
  status: 'normal' | 'alert' | 'critical';
  lastUpdated: string;
  history: { time: string; value: number }[];
}

export interface CityMetrics {
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
  lastSync: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: 'City Architect' | 'Agronomist' | 'Systems Operator' | 'Guest Overseer';
  token?: string;
}

export interface CityPreset {
  id: string;
  name: string;
  region: string;
  focus: string;
  badge?: string;
}

export interface SimulationState {
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  simulationSpeed: 1 | 2 | 5;
  weatherCondition: 'clear' | 'monitored_rain' | 'heatwave' | 'optimal_mist';
  automatedIrrigationActive: boolean;
  droneSurveillanceActive: boolean;
  gridStabilizationActive: boolean;
}
