import React from 'react';
import { SmartCityScene } from './SmartCityScene';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface CityMasterSceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  focusedZonePos?: [number, number, number] | null;
}

export const CityMasterScene: React.FC<CityMasterSceneProps> = (props) => {
  return <SmartCityScene {...props} />;
};
