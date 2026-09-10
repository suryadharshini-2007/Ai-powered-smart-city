import { useState, useEffect } from 'react';
import { CityMetrics, ZoneSummary } from '../types';
import { apiService } from '../services/api';
import { initialCityMetrics, zoneSummaries } from '../data/centralizedMockData';

export function useCityData() {
  const getSavedCity = () => localStorage.getItem('smart_city_selected_city') || initialCityMetrics.cityName;

  const [metrics, setMetrics] = useState<CityMetrics>(() => ({
    ...initialCityMetrics,
    cityName: getSavedCity(),
  }));
  const [zones, setZones] = useState<ZoneSummary[]>(Object.values(zoneSummaries));
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [metricsRes, zonesRes] = await Promise.all([
          apiService.getCityMetrics(),
          apiService.getZones(),
        ]);
        if (mounted) {
          const savedCity = localStorage.getItem('smart_city_selected_city');
          setMetrics({
            ...metricsRes.data,
            cityName: savedCity || metricsRes.data.cityName || initialCityMetrics.cityName,
          });
          setZones(zonesRes.data);
          setIsLiveApi(metricsRes.isLive);
        }
      } catch (err) {
        console.error('Failed to load city data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    const handleCityChange = (e: Event) => {
      const custom = e as CustomEvent<{ cityName: string }>;
      if (custom.detail?.cityName) {
        setMetrics((prev) => ({ ...prev, cityName: custom.detail.cityName }));
      }
    };

    window.addEventListener('smart_city_changed', handleCityChange);
    return () => {
      mounted = false;
      window.removeEventListener('smart_city_changed', handleCityChange);
    };
  }, []);

  return { metrics, zones, isLiveApi, loading };
}
