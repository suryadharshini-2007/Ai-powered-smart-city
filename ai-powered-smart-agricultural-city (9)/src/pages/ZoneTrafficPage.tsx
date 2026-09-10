import React from 'react';
import { Car } from 'lucide-react';
import { FullscreenSceneLayout } from '../layouts/FullscreenSceneLayout';
import { TrafficScene } from '../3d/traffic/TrafficScene';
import { zoneSummaries } from '../data/centralizedMockData';

export const ZoneTrafficPage: React.FC = () => {
  const zone = zoneSummaries.traffic;

  return (
    <FullscreenSceneLayout zone={zone} icon={Car} hideSimulationBar>
      {({ simulationState, setSelectedNode, cameraPreset }) => (
        <TrafficScene
          simulationState={simulationState}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      )}
    </FullscreenSceneLayout>
  );
};
