import React from 'react';
import { Sun, Moon, Droplets, FastForward, Play, ShieldAlert } from 'lucide-react';
import { SimulationState } from '../types';

interface SimulationControlsProps {
  simulation: SimulationState;
  onToggleDayNight: () => void;
  onToggleIrrigation: () => void;
  onToggleDrones?: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
  className?: string;
}

export const SimulationButton: React.FC<SimulationControlsProps> = ({
  simulation,
  onToggleDayNight,
  onToggleIrrigation,
  onToggleDrones,
  onSetSpeed,
  className = '',
}) => {
  const isNight = simulation.timeOfDay === 'night' || simulation.timeOfDay === 'dusk';

  return (
    <div
      id="simulation-control-toolbar"
      className={`flex items-center flex-wrap gap-2 p-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-xl ${className}`}
    >
      {/* Day / Night cycle */}
      <button
        id="btn-sim-day-night"
        type="button"
        onClick={onToggleDayNight}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-white border border-slate-700/60 transition-all"
        title="Cycle Circadian Solar Simulation (Day/Dusk/Night/Dawn)"
      >
        {isNight ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span className="capitalize font-mono">{simulation.timeOfDay}</span>
      </button>

      {/* Irrigation */}
      <button
        id="btn-sim-irrigation"
        type="button"
        onClick={onToggleIrrigation}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
          simulation.automatedIrrigationActive
            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
            : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700/60'
        }`}
        title="Toggle Automated Aeroponic/Hydro Mist Delivery"
      >
        <Droplets className={`w-3.5 h-3.5 ${simulation.automatedIrrigationActive ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
        <span>Irrigation: {simulation.automatedIrrigationActive ? 'Active' : 'Standby'}</span>
      </button>

      {/* Drones */}
      {onToggleDrones && (
        <button
          id="btn-sim-drones"
          type="button"
          onClick={onToggleDrones}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            simulation.droneSurveillanceActive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
          title="Toggle Crop Monitoring & Pollination Drones"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agri-Drones: {simulation.droneSurveillanceActive ? 'Scanning' : 'Docked'}</span>
        </button>
      )}

      {/* Speed Multiplier */}
      <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
        <span className="text-[10px] font-mono text-slate-400 mr-1 hidden sm:inline">Rate</span>
        {([1, 2, 5] as const).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onSetSpeed(s)}
            className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              simulation.simulationSpeed === s
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
