import {
  StreetlightData,
  CCTVCameraData,
  SolarData,
  WaterInfrastructureData,
  RoadInfrastructureData,
  EVChargerData,
  SmartPoleData,
  InfrastructureMetrics,
} from './InfrastructureTypes';

export const INITIAL_STREETLIGHTS: StreetlightData[] = [
  {
    id: 'light-01',
    lightId: 'SL-CORRIDOR-01',
    name: 'Adaptive Smart Luminaire #01 (East Approach)',
    brightness: 30,
    idleBrightness: 25,
    activeBrightness: 100,
    energyConsumptionWatts: 24,
    motionDetected: false,
    status: 'Adaptive Auto',
    position: [-8, 0, 4.5],
    orientation: 0,
    sensorRadius: 5.5,
    approachingEntity: null,
  },
  {
    id: 'light-02',
    lightId: 'SL-CORRIDOR-02',
    name: 'Adaptive Smart Luminaire #02 (Mid-Crossing)',
    brightness: 30,
    idleBrightness: 25,
    activeBrightness: 100,
    energyConsumptionWatts: 24,
    motionDetected: false,
    status: 'Adaptive Auto',
    position: [0, 0, 4.5],
    orientation: 0,
    sensorRadius: 5.5,
    approachingEntity: null,
  },
  {
    id: 'light-03',
    lightId: 'SL-CORRIDOR-03',
    name: 'Adaptive Smart Luminaire #03 (West Approach)',
    brightness: 30,
    idleBrightness: 25,
    activeBrightness: 100,
    energyConsumptionWatts: 24,
    motionDetected: false,
    status: 'Adaptive Auto',
    position: [8, 0, 4.5],
    orientation: 0,
    sensorRadius: 5.5,
    approachingEntity: null,
  },
  {
    id: 'light-04',
    lightId: 'SL-PATHWAY-04',
    name: 'Pedestrian Smart Pole Luminaire #04',
    brightness: 35,
    idleBrightness: 30,
    activeBrightness: 95,
    energyConsumptionWatts: 28,
    motionDetected: false,
    status: 'Adaptive Auto',
    position: [-4, 0, -4.5],
    orientation: Math.PI,
    sensorRadius: 5.0,
    approachingEntity: null,
  },
  {
    id: 'light-05',
    lightId: 'SL-CHARGING-05',
    name: 'EV Hub Safety Smart Luminaire #05',
    brightness: 35,
    idleBrightness: 30,
    activeBrightness: 95,
    energyConsumptionWatts: 28,
    motionDetected: false,
    status: 'Adaptive Auto',
    position: [4, 0, -4.5],
    orientation: Math.PI,
    sensorRadius: 5.0,
    approachingEntity: null,
  },
];

export const INITIAL_CCTV_CAMERAS: CCTVCameraData[] = [
  {
    id: 'cctv-01',
    cameraId: 'CCTV-SEC-01',
    location: 'Intersection & Pedestrian Crosswalk 3A',
    peopleDetected: 3,
    vehiclesDetected: 2,
    safetyStatus: 'Surveillance Active',
    position: [0, 5.8, 4.5],
    panAngleRange: [-Math.PI / 3, Math.PI / 3],
  },
  {
    id: 'cctv-02',
    cameraId: 'CCTV-EV-02',
    location: 'Ultra-Fast EV Charging Bay Sector',
    peopleDetected: 1,
    vehiclesDetected: 2,
    safetyStatus: 'Normal',
    position: [9.5, 5.6, -7.5],
    panAngleRange: [-Math.PI / 4, Math.PI / 4],
  },
];

export const INITIAL_SOLAR_DATA: SolarData = {
  solarGenerationKw: 156.4,
  energyConsumptionKw: 92.8,
  batteryPercent: 91,
  gridUsageKw: -63.6, // Net export to smart grid
  batteryCapacityKwh: 480,
  panelEfficiencyPercent: 24.8,
};

export const INITIAL_WATER_DATA: WaterInfrastructureData = {
  waterLevelPercent: 88.5,
  dailyUsageLiters: 34200,
  rainwaterCollectedLiters: 16800,
  recycledWaterPercent: 96.4,
  leakStatus: 'Normal (0 Leaks Detected)',
  hasActiveLeak: false,
  leakJunction: 'Sector 3B Subterranean Manifold',
  leakRateLpm: 0,
  valveIsolated: false,
};

export const INITIAL_ROAD_DATA: RoadInfrastructureData = {
  trafficCondition: 'Smooth Flow (Autonomous V2X)',
  roadHealthPercent: 98.4,
  smartSensorsCount: 64,
  communicationStatus: '5G C-V2X (1.8 ms latency)',
  averageSpeedKmH: 34.2,
  piezoelectricGenerationKw: 14.6,
  inductiveLaneActive: true,
};

export const INITIAL_EV_CHARGERS: EVChargerData[] = [
  {
    id: 'ev-bay-01',
    stationId: 'EV-HYPER-01',
    stationName: 'Hyper-Charge Bay 01 (Liquid Cooled)',
    vehicleModel: 'EcoVolt Transit Shuttle #08',
    batteryPercent: 74,
    targetBatteryPercent: 95,
    chargingPowerKw: 280,
    status: 'Charging (Ultra-Fast DC)',
    isCharging: true,
    position: [8.5, 0, -8.5],
  },
  {
    id: 'ev-bay-02',
    stationId: 'EV-HYPER-02',
    stationName: 'Hyper-Charge Bay 02 (Robotic Arm)',
    vehicleModel: 'Apex Autonomous Cargo EV #22',
    batteryPercent: 42,
    targetBatteryPercent: 90,
    chargingPowerKw: 350,
    status: 'Charging (Ultra-Fast DC)',
    isCharging: true,
    position: [12.5, 0, -8.5],
  },
];

export const INITIAL_SMART_POLES: SmartPoleData[] = [
  {
    poleId: 'POLE-5G-01',
    name: 'Multifunction Civic IoT Smart Pole #01',
    airQualityAqi: 24, // Good
    ambientTempC: 22.4,
    telecomCoverage: '5G NR Ultra-Wideband (Sub-6 + mmWave)',
    civicStatus: 'Grid Synchronized & Environmental Mesh Active',
    position: [-4.5, 0, 4.5],
  },
  {
    poleId: 'POLE-5G-02',
    name: 'Multifunction Civic IoT Smart Pole #02',
    airQualityAqi: 22,
    ambientTempC: 22.6,
    telecomCoverage: '5G NR Ultra-Wideband (Low-Latency C-V2X)',
    civicStatus: 'Emergency Voice Intercom Ready',
    position: [4.5, 0, 4.5],
  },
];

export const INITIAL_INFRA_METRICS: InfrastructureMetrics = {
  totalPowerGenerationKw: 171.0, // Solar + Piezo
  totalPowerConsumptionKw: 104.2,
  bessChargePercent: 91,
  streetlightsActive: 5,
  smartPolesOnline: 2,
  evChargersOccupied: 2,
  cctvStreamsActive: 2,
  waterReservesLiters: 145000,
  leakAnomalyDetected: false,
};
