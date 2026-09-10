import { useState, useEffect } from 'react';
import { ZoneSummary, SensorReading } from '../types';
import { apiService } from '../services/api';
import { zoneSummaries, sampleSensorReadings } from '../data/centralizedMockData';

export function useZoneTelemetry(zoneId?: string) {
  const [zone, setZone] = useState<ZoneSummary | null>(() => {
    return zoneId ? (zoneSummaries[zoneId] || null) : null;
  });
  const [sensors, setSensors] = useState<SensorReading[]>(() => {
    return zoneId ? sampleSensorReadings.filter(s => s.zoneId === zoneId) : sampleSensorReadings;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!zoneId) return;
    let isMounted = true;
    setLoading(true);

    async function fetchData() {
      try {
        const [zRes, sRes] = await Promise.all([
          apiService.getZone(zoneId!),
          apiService.getSensorReadings(zoneId),
        ]);
        if (isMounted) {
          setZone(zRes.data);
          setSensors(sRes.data);
        }
      } catch (e) {
        console.error('Error fetching zone telemetry', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [zoneId]);

  return { zone, sensors, loading };
}
