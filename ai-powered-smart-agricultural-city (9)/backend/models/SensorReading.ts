export interface ISensorReading {
  id: string;
  name: string;
  zoneId: string;
  type: string;
  value: number;
  unit: string;
  targetRange: [number, number];
  status: 'normal' | 'alert' | 'critical';
  lastUpdated: string;
  history: { time: string; value: number }[];
}

const sensorsStore: ISensorReading[] = [
  {
    id: 'sns-ag-01',
    name: 'Vertical Tower Hydroponic EC Level',
    zoneId: 'agriculture',
    type: 'nutrient_ec',
    value: 2.18,
    unit: 'mS/cm',
    targetRange: [1.8, 2.4],
    status: 'normal',
    lastUpdated: '10s ago',
    history: [
      { time: '06:00', value: 2.1 },
      { time: '08:00', value: 2.15 },
      { time: '10:00', value: 2.22 },
      { time: '12:00', value: 2.18 },
      { time: '14:00', value: 2.19 },
    ],
  },
  {
    id: 'sns-ag-02',
    name: 'Canopy Vapor Pressure Deficit (VPD)',
    zoneId: 'agriculture',
    type: 'air_quality',
    value: 1.15,
    unit: 'kPa',
    targetRange: [0.9, 1.3],
    status: 'normal',
    lastUpdated: '15s ago',
    history: [
      { time: '06:00', value: 1.0 },
      { time: '08:00', value: 1.1 },
      { time: '10:00', value: 1.22 },
      { time: '12:00', value: 1.15 },
    ],
  },
  {
    id: 'sns-tf-01',
    name: 'Autonomous Freight Flow Velocity',
    zoneId: 'traffic',
    type: 'traffic_flow',
    value: 48.5,
    unit: 'km/h',
    targetRange: [40, 60],
    status: 'normal',
    lastUpdated: '5s ago',
    history: [
      { time: '06:00', value: 52 },
      { time: '08:00', value: 46 },
      { time: '10:00', value: 48 },
    ],
  },
];

export const SensorReadingModel = {
  async find(filter?: { zoneId?: string }): Promise<ISensorReading[]> {
    if (filter?.zoneId) {
      return sensorsStore.filter(s => s.zoneId === filter.zoneId);
    }
    return sensorsStore;
  },

  async findById(id: string): Promise<ISensorReading | null> {
    return sensorsStore.find(s => s.id === id) || null;
  },

  async appendReading(id: string, value: number): Promise<ISensorReading | null> {
    const sensor = sensorsStore.find(s => s.id === id);
    if (!sensor) return null;
    sensor.value = value;
    sensor.lastUpdated = 'Just now';
    sensor.history.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value,
    });
    if (sensor.history.length > 20) sensor.history.shift();
    return sensor;
  },
};
