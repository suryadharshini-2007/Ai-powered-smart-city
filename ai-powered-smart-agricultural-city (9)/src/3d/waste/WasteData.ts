import { SmartBinData, WasteMetrics } from './WasteTypes';

export const INITIAL_SMART_BINS: SmartBinData[] = [
  {
    id: 'bin-01',
    name: 'Smart Bin Cluster #01 (Civic Plaza)',
    locationName: 'North Civic Concourse',
    position: [-8, 0, 6],
    fillLevel: 68,
    composition: {
      organic: 42,
      plastic: 27,
      paper: 18,
      other: 13,
    },
    isCritical: false,
    status: 'normal',
  },
  {
    id: 'bin-02',
    name: 'Smart Bin Cluster #02 (Agri-Market)',
    locationName: 'Produce & Grain Hub',
    position: [-11, 0, -2],
    fillLevel: 89,
    composition: {
      organic: 65,
      plastic: 15,
      paper: 12,
      other: 8,
    },
    isCritical: true,
    status: 'critical',
  },
  {
    id: 'bin-03',
    name: 'Smart Bin Cluster #03 (Robotics Lab)',
    locationName: 'Innovation Avenue',
    position: [9, 0, 7],
    fillLevel: 44,
    composition: {
      organic: 20,
      plastic: 38,
      paper: 30,
      other: 12,
    },
    isCritical: false,
    status: 'normal',
  },
  {
    id: 'bin-04',
    name: 'Smart Bin Cluster #04 (Residential Sector)',
    locationName: 'Green Terrace Gateway',
    position: [12, 0, -1],
    fillLevel: 58,
    composition: {
      organic: 38,
      plastic: 32,
      paper: 20,
      other: 10,
    },
    isCritical: false,
    status: 'normal',
  },
];

export const INITIAL_WASTE_METRICS: WasteMetrics = {
  wasteCollectedTodayKg: 4820,
  recyclingRatePercent: 86.4,
  organicWasteKg: 2025,
  plasticWasteKg: 1310,
  paperWasteKg: 865,
  otherWasteKg: 620,
  activeCollectionRobots: 3,
  co2SavedTons: 1.84,
  compostProducedKg: 1450,
};
