import React from 'react';
import { Recycle } from 'lucide-react';
import { FullscreenSceneLayout } from '../layouts/FullscreenSceneLayout';
import { WasteScene } from '../3d/waste/WasteScene';
import { zoneSummaries } from '../data/centralizedMockData';

export const ZoneWastePage: React.FC = () => {
  const zone = zoneSummaries.waste;

  return (
    <FullscreenSceneLayout zone={zone} icon={Recycle}>
      {({ simulationState, setSelectedNode, cameraPreset }) => (
        <WasteScene
          simulationState={simulationState}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      )}
    </FullscreenSceneLayout>
  );
};
