export type TrafficStateMode =
  | 'NORMAL'
  | 'CONGESTION'
  | 'ACCIDENT'
  | 'OVERSPEED'
  | 'RED_LIGHT_VIOLATION'
  | 'NO_HELMET'
  | 'WRONG_WAY'
  | 'PEDESTRIAN_CROSSING'
  | 'DANGEROUS_VEHICLE';

export interface VehicleData {
  id: string;
  type: 'car' | 'suv' | 'bus' | 'truck' | 'motorcycle' | 'ambulance';
  plate: string;
  speedKmH: number;
  lane: 'NS_SOUTH' | 'NS_NORTH' | 'EW_WEST' | 'EW_EAST';
  color: string;
  hasHelmet?: boolean;
  status: 'cruising' | 'stopped' | 'speeding' | 'violating' | 'crashed' | 'emergency';
}

export interface ViolationRecord {
  id: string;
  vehiclePlate: string;
  vehicleType: string;
  violation: string;
  speed: string;
  confidence: number;
  status: 'Recorded' | 'Challan Dispatched' | 'Flagged to Police';
  timestamp: string;
}

export interface AccidentTelemetry {
  detected: boolean;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  alertSent: boolean;
  stage: 'idle' | 'drone_investigating' | 'accident_confirmed' | 'alert_broadcast' | 'ambulance_enroute' | 'scene_secured';
  commStep: number; // 0: None, 1: Drone, 2: AI Traffic, 3: Control Center, 4: Hospital, 5: Ambulance
}

export interface PedestrianCrossingState {
  active: boolean;
  step: number; // 0 to 8
  gateAngle: number; // 0 (open for pedestrians/closed to vehicles) to Math.PI/2
  lightState: 'RED' | 'YELLOW' | 'GREEN';
  pedestrianProgress: number; // 0 to 1 crossing ratio
}

export interface InflatableBarrierState {
  inflated: boolean;
  inflationProgress: number; // 0 (flat mat) to 1 (full safety cushion)
  status: 'STANDBY' | 'ACTIVATING' | 'IMPACT_ABSORBED' | 'PROTECTED';
  impactRisk: boolean;
}

export interface EnergyPathwayStats {
  footsteps: number;
  mechanicalKj: number;
  electricalKj: number;
  efficiencyPercent: number;
}
