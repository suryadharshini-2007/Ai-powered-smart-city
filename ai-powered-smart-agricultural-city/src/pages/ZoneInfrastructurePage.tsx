import React from 'react';
import { Zap } from 'lucide-react';
import { FullscreenSceneLayout } from '../layouts/FullscreenSceneLayout';
import { InfrastructureScene } from '../3d/infrastructure/InfrastructureScene';
import { zoneSummaries } from '../data/centralizedMockData';

export const ZoneInfrastructurePage: React.FC = () => {
  const zone = zoneSummaries.infrastructure;

  return (
    <FullscreenSceneLayout zone={zone} icon={Zap}>
      {({ simulationState, setSelectedNode, cameraPreset }) => (
        <InfrastructureScene
          simulationState={simulationState}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      )}
    </FullscreenSceneLayout>
  );
};
