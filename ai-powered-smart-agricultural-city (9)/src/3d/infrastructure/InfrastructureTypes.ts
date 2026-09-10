export interface StreetlightData {
  id: string;
  lightId: string;
  name: string;
  brightness: number; // 0 - 100%
  idleBrightness: number;
  activeBrightness: number;
  energyConsumptionWatts: number;
  motionDetected: boolean;
  status: 'Adaptive Auto' | 'Scheduled' | 'Emergency Alert';
  position: [number, number, number];
  orientation: number;
  sensorRadius: number;
  approachingEntity?: string | null;
}

export interface CCTVCameraData {
  id: string;
  cameraId: string;
  location: string;
  peopleDetected: number;
  vehiclesDetected: number;
  safetyStatus: 'Normal' | 'Surveillance Active' | 'Alert Triggered';
  position: [number, number, number];
  panAngleRange: [number, number]; // min and max rad
}

export interface SolarData {
  solarGenerationKw: number;
  energyConsumptionKw: number;
  batteryPercent: number;
  gridUsageKw: number; // negative = exporting
  batteryCapacityKwh: number;
  panelEfficiencyPercent: number;
}

export interface WaterInfrastructureData {
  waterLevelPercent: number;
  dailyUsageLiters: number;
  rainwaterCollectedLiters: number;
  recycledWaterPercent: number;
  leakStatus: 'Normal (0 Leaks Detected)' | 'Acoustic Alert: Fissure Detected';
  hasActiveLeak: boolean;
  leakJunction: string;
  leakRateLpm: number;
  valveIsolated: boolean;
}

export interface RoadInfrastructureData {
  trafficCondition: 'Smooth Flow (Autonomous V2X)' | 'Moderate Density' | 'Congested';
  roadHealthPercent: number;
  smartSensorsCount: number;
  communicationStatus: '5G C-V2X (1.8 ms latency)' | 'Mesh Sync' | 'Degraded';
  averageSpeedKmH: number;
  piezoelectricGenerationKw: number;
  inductiveLaneActive: boolean;
}

export interface EVChargerData {
  id: string;
  stationId: string;
  stationName: string;
  vehicleModel: string;
  batteryPercent: number;
  targetBatteryPercent: number;
  chargingPowerKw: number;
  status: 'Charging (Ultra-Fast DC)' | 'Idle / Available' | 'Completed' | 'Standby';
  isCharging: boolean;
  position: [number, number, number];
}

export interface SmartPoleData {
  poleId: string;
  name: string;
  airQualityAqi: number;
  ambientTempC: number;
  telecomCoverage: string;
  civicStatus: string;
  position: [number, number, number];
}

export interface InfrastructureMetrics {
  totalPowerGenerationKw: number;
  totalPowerConsumptionKw: number;
  bessChargePercent: number;
  streetlightsActive: number;
  smartPolesOnline: number;
  evChargersOccupied: number;
  cctvStreamsActive: number;
  waterReservesLiters: number;
  leakAnomalyDetected: boolean;
}
