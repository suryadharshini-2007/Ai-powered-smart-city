import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Sun,
  Droplets,
  Zap,
  Activity,
  Maximize2,
  Compass,
  Sliders,
  Car,
  GraduationCap,
  Store,
  Recycle,
} from 'lucide-react';
import { CityMasterScene } from '../3d/city/CityMasterScene';
import { ObjectInfoPanel, SelectedNodeDetails } from '../components/ObjectInfoPanel';
import { SimulationButton } from '../components/SimulationButton';
import { CameraPresetBar } from '../components/CameraControls';
import { StatusBadge } from '../components/StatusBadge';
import { useCityData } from '../hooks/useCityData';
import { useSimulation } from '../hooks/useSimulation';
import { useAuth } from '../context/AuthContext';
import { zoneSummaries } from '../data/centralizedMockData';
import { formatNumber, formatPercent } from '../utils/formatters';

export const MasterCityPage: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, loading } = useCityData();
  const { selectedCity } = useAuth();
  const { simulation, toggleDayNight, toggleIrrigation, toggleDroneSurveillance, setSpeed } = useSimulation();
  const [selectedNode, setSelectedNode] = useState<SelectedNodeDetails | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'topDown' | 'isometric' | 'closeUp'>('overview');

  const zoneShortcuts = [
    { id: 'agriculture', name: 'Agriculture', path: '/zone/agriculture', icon: Sprout, color: '#22c55e' },
    { id: 'traffic', name: 'Transit', path: '/zone/traffic', icon: Car, color: '#38bdf8' },
    { id: 'school', name: 'Academy', path: '/zone/school', icon: GraduationCap, color: '#a855f7' },
    { id: 'market', name: 'Bio-Market', path: '/zone/market', icon: Store, color: '#f59e0b' },
    { id: 'waste', name: 'Bio-Refinery', path: '/zone/waste', icon: Recycle, color: '#14b8a6' },
    { id: 'infrastructure', name: 'Hydro-Grid', path: '/zone/infrastructure', icon: Zap, color: '#6366f1' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden bg-slate-950 select-none">
      {/* 3D Master City Canvas */}
      <div className="absolute inset-0 z-0">
        <CityMasterScene
          simulationState={simulation}
          onSelectNode={setSelectedNode}
          cameraPreset={cameraPreset}
        />
      </div>

      {/* Top HUD: City Telemetry Ribbon */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* City Title & Status */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold leading-tight">
                SMART AGRICULTURAL CITY
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-heading font-bold text-white tracking-wide">
                  {selectedCity || metrics.cityName}
                </h1>
                <StatusBadge status={metrics.status} size="sm" />
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Pop: {formatNumber(metrics.population)} &bull; {metrics.totalAcreageHectares} Hectares
              </p>
            </div>
          </div>

          {/* Quick Zone Jump Pills */}
          <div className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-xl">
            {zoneShortcuts.map((z) => {
              const Icon = z.icon;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => navigate(z.path)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700/80 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: z.color }} />
                  <span>{z.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Grid Key Telemetry Chips */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 shadow-xl">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Sun className="w-3.5 h-3.5" />
              <span>{formatNumber(metrics.solarGenerationKw)} kW</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Sprout className="w-3.5 h-3.5" />
              <span>{formatNumber(metrics.dailyCropYieldKg)} kg/d</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-sky-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>{formatPercent(metrics.waterRecycledPercentage)} Recycled</span>
            </div>
          </div>

          <CameraPresetBar
            currentPreset={cameraPreset}
            onSelectPreset={setCameraPreset}
          />
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        {/* Simulation Controls */}
        <div className="pointer-events-auto">
          <SimulationButton
            simulation={simulation}
            onToggleDayNight={toggleDayNight}
            onToggleIrrigation={toggleIrrigation}
            onToggleDrones={toggleDroneSurveillance}
            onSetSpeed={setSpeed}
          />
        </div>

        {/* Action Callout */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Click any 3D Zone Label or building node to inspect detailed metrics</span>
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
