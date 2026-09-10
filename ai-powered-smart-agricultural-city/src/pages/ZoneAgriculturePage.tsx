import React from 'react';
import { Sprout } from 'lucide-react';
import { FullscreenSceneLayout } from '../layouts/FullscreenSceneLayout';
import { AgricultureScene } from '../3d/agriculture/AgricultureScene';
import { zoneSummaries } from '../data/centralizedMockData';

export const ZoneAgriculturePage: React.FC = () => {
  const zone = zoneSummaries.agriculture;

  return (
    <FullscreenSceneLayout zone={zone} icon={Sprout}>
      {({ simulationState, setSelectedNode, cameraPreset }) => (
        <AgricultureScene
          simulationState={simulationState}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      )}
    </FullscreenSceneLayout>
  );
};
