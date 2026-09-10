export type WasteCategory = 'organic' | 'plastic' | 'paper' | 'other';

export interface SmartBinData {
  id: string;
  name: string;
  locationName: string;
  position: [number, number, number];
  fillLevel: number; // 0 to 100
  composition: {
    organic: number; // percentage
    plastic: number;
    paper: number;
    other: number;
  };
  isCritical: boolean;
  status: 'normal' | 'filling' | 'critical' | 'collecting';
}

export type SegregationStage =
  | 'WASTE_INPUT'
  | 'AI_CLASSIFICATION'
  | 'ORGANIC'
  | 'PLASTIC'
  | 'PAPER'
  | 'OTHER'
  | 'RECYCLING_PROCESSING';

export interface SortingWasteItem {
  id: number;
  type: WasteCategory;
  name: string;
  progress: number; // 0 to 1 along conveyor
  color: string;
  divertedStage?: SegregationStage;
}

export type CollectionRobotStage =
  | 'IDLE'
  | 'COLLECTION_REQUEST'
  | 'ROBOT_DISPATCHED'
  | 'COLLECTING'
  | 'RETURNING'
  | 'COMPLETED';

export interface WasteMetrics {
  wasteCollectedTodayKg: number;
  recyclingRatePercent: number;
  organicWasteKg: number;
  plasticWasteKg: number;
  paperWasteKg: number;
  otherWasteKg: number;
  activeCollectionRobots: number;
  co2SavedTons: number;
  compostProducedKg: number;
}
