import React, { useState } from 'react';
import { BackButton } from '../components/BackButton';
import { HomeButton } from '../components/HomeButton';
import { StatusBadge } from '../components/StatusBadge';
import { CameraPresetBar } from '../components/CameraControls';
import { SimulationButton } from '../components/SimulationButton';
import { ObjectInfoPanel, SelectedNodeDetails } from '../components/ObjectInfoPanel';
import { ZoneSummary } from '../types';
import { useSimulation } from '../hooks/useSimulation';
import { useAuth } from '../context/AuthContext';
import { LucideIcon } from 'lucide-react';

interface FullscreenSceneLayoutProps {
  zone: ZoneSummary;
  icon: LucideIcon;
  hideSimulationBar?: boolean;
  children: (props: {
    simulationState: ReturnType<typeof useSimulation>['simulation'];
    selectedNode: SelectedNodeDetails | null;
    setSelectedNode: (node: SelectedNodeDetails | null) => void;
    cameraPreset: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  }) => React.ReactNode;
}

export const FullscreenSceneLayout: React.FC<FullscreenSceneLayoutProps> = ({
  zone,
  icon: Icon,
  hideSimulationBar = false,
  children,
}) => {
  const { simulation, toggleDayNight, toggleIrrigation, toggleDroneSurveillance, setSpeed } = useSimulation();
  const { selectedCity } = useAuth();
  const [selectedNode, setSelectedNode] = useState<SelectedNodeDetails | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'topDown' | 'isometric' | 'closeUp'>('overview');

  return (
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden bg-slate-950 select-none">
      {/* 3D Scene Viewport (Full Screen Canvas) */}
      <div className="absolute inset-0 z-0">
        {children({
          simulationState: simulation,
          selectedNode,
          setSelectedNode,
          cameraPreset,
        })}
      </div>

      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Navigation & Zone Header */}
        <div className="pointer-events-auto flex items-center gap-2">
          <BackButton label="BACK" fallbackTo="/city" />
          <HomeButton label="BACK TO CITY" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-xl">
            <div className="p-1 rounded-lg bg-slate-900" style={{ color: zone.color }}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                SMART AGRICULTURAL CITY &bull; {selectedCity}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-bold text-white">
                  {zone.name}
                </span>
                <StatusBadge status={zone.status} size="sm" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Efficiency: {zone.efficiency}% &bull; {zone.activeSensors} IoT Nodes
              </span>
            </div>
          </div>
        </div>

        {/* Camera Preset Selector */}
        <div className="pointer-events-auto">
          <CameraPresetBar
            currentPreset={cameraPreset}
            onSelectPreset={setCameraPreset}
          />
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        {/* Simulation Controls */}
        {!hideSimulationBar && (
          <div className="pointer-events-auto">
            <SimulationButton
              simulation={simulation}
              onToggleDayNight={toggleDayNight}
              onToggleIrrigation={toggleIrrigation}
              onToggleDrones={toggleDroneSurveillance}
              onSetSpeed={setSpeed}
            />
          </div>
        )}

        {/* Interactive Helper Hint */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Left-click & drag to orbit &bull; Scroll to zoom &bull; Click 3D structures to inspect</span>
        </div>
      </div>

      {/* Dockable Object Inspector Panel */}
      <div className="pointer-events-auto">
        <ObjectInfoPanel
          data={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
};
