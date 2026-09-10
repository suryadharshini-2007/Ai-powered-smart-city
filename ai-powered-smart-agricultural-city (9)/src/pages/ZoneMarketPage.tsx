import React from 'react';
import { Store } from 'lucide-react';
import { FullscreenSceneLayout } from '../layouts/FullscreenSceneLayout';
import { MarketScene } from '../3d/market/MarketScene';
import { zoneSummaries } from '../data/centralizedMockData';

export const ZoneMarketPage: React.FC = () => {
  const zone = zoneSummaries.market;

  return (
    <FullscreenSceneLayout zone={zone} icon={Store}>
      {({ simulationState, setSelectedNode, cameraPreset }) => (
        <MarketScene
          simulationState={simulationState}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      )}
    </FullscreenSceneLayout>
  );
};
