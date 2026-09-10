export type ClassroomScreenMode =
  | 'DIGITAL_LESSON'
  | 'AI_CONTENT'
  | 'INTERACTIVE_DIAGRAM'
  | 'STUDENT_ANALYTICS';

export type SportType =
  | 'Cricket'
  | 'Football'
  | 'Basketball'
  | 'Volleyball'
  | 'Kabaddi'
  | 'Badminton';

export type CourtPrepStage =
  | 'IDLE'
  | 'GAME_SELECTED'
  | 'PREPARING_COURT'
  | 'MARKING_FIELD'
  | 'PLACING_EQUIPMENT'
  | 'COURT_READY';

export interface AiRobotState {
  id: string;
  name: string;
  status: 'Idle' | 'Patrolling' | 'Assisting Student' | 'Guiding Class';
  currentTask: string;
  studentsAssisted: number;
  safetyStatus: string;
  isDemonstrating: boolean;
  position: [number, number, number];
}

export interface ParkingBayState {
  id: string;
  bayNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'EV_CHARGING';
  vehicleType?: string;
  powerKw?: number;
}

export interface RestroomState {
  sensorTapsActive: boolean;
  autoFlushActive: boolean;
  waterSavingPercent: number;
  leakDetectionRateLph: number;
  autoCleaningStatus: 'READY' | 'CLEANING' | 'DISINFECTED';
  wasteSegregationEfficiency: number;
  greywaterReuseLitres: number;
}

export interface SolarTelemetry {
  powerGeneratedKw: number;
  currentEnergyKwh: number;
  consumptionKw: number;
  batteryStoragePercent: number;
}

export interface RainwaterTelemetry {
  harvestedTodayLitres: number;
  tankCapacityLitres: number;
  filtrationEfficiency: number;
  currentFlowLpm: number;
  destination: string;
}

export interface SportGuideInfo {
  name: SportType;
  rules: string[];
  currentGame: string;
  currentScore: string;
  basicInstructions: string[];
  equipmentNeeded: string[];
}
