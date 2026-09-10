import { useState, useCallback } from 'react';
import { SimulationState } from '../types';
import { defaultSimulationState } from '../data/centralizedMockData';
import { apiService } from '../services/api';

export function useSimulation() {
  const [simulation, setSimulation] = useState<SimulationState>(defaultSimulationState);

  const toggleDayNight = useCallback(() => {
    setSimulation(prev => {
      const order: SimulationState['timeOfDay'][] = ['day', 'dusk', 'night', 'dawn'];
      const currentIndex = order.indexOf(prev.timeOfDay);
      const nextTime = order[(currentIndex + 1) % order.length];
      const updated = { ...prev, timeOfDay: nextTime };
      apiService.updateSimulationState({ timeOfDay: nextTime }).catch(() => {});
      return updated;
    });
  }, []);

  const toggleIrrigation = useCallback(() => {
    setSimulation(prev => {
      const updated = { ...prev, automatedIrrigationActive: !prev.automatedIrrigationActive };
      apiService.updateSimulationState({ automatedIrrigationActive: updated.automatedIrrigationActive }).catch(() => {});
      return updated;
    });
  }, []);

  const toggleDroneSurveillance = useCallback(() => {
    setSimulation(prev => {
      const updated = { ...prev, droneSurveillanceActive: !prev.droneSurveillanceActive };
      apiService.updateSimulationState({ droneSurveillanceActive: updated.droneSurveillanceActive }).catch(() => {});
      return updated;
    });
  }, []);

  const setSpeed = useCallback((speed: 1 | 2 | 5) => {
    setSimulation(prev => {
      const updated = { ...prev, simulationSpeed: speed };
      apiService.updateSimulationState({ simulationSpeed: speed }).catch(() => {});
      return updated;
    });
  }, []);

  return {
    simulation,
    toggleDayNight,
    toggleIrrigation,
    toggleDroneSurveillance,
    setSpeed,
  };
}
