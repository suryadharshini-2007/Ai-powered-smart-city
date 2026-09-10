import React from 'react';
import { GraduationCap } from 'lucide-react';
import { FullscreenSceneLayout } from '../layouts/FullscreenSceneLayout';
import { SchoolScene } from '../3d/school/SchoolScene';
import { zoneSummaries } from '../data/centralizedMockData';

export const ZoneSchoolPage: React.FC = () => {
  const zone = zoneSummaries.school;

  return (
    <FullscreenSceneLayout zone={zone} icon={GraduationCap}>
      {({ simulationState, setSelectedNode, cameraPreset }) => (
        <SchoolScene
          simulationState={simulationState}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      )}
    </FullscreenSceneLayout>
  );
};
