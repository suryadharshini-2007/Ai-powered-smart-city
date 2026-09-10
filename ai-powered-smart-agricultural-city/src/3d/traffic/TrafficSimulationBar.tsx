import React from 'react';
import {
  AlertTriangle,
  Gauge,
  ShieldAlert,
  Navigation,
  Activity,
  Footprints,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { TrafficStateMode } from './TrafficTypes';

interface TrafficSimulationBarProps {
  currentMode: TrafficStateMode;
  onTriggerAccident: () => void;
  onTriggerOverspeed: () => void;
  onTriggerNoHelmet: () => void;
  onTriggerWrongWay: () => void;
  onTriggerCongestion: () => void;
  onTriggerPedestrianCrossing: () => void;
  onTriggerDangerousVehicle: () => void;
  onResetNormal: () => void;
}

export const TrafficSimulationBar: React.FC<TrafficSimulationBarProps> = ({
  currentMode,
  onTriggerAccident,
  onTriggerOverspeed,
  onTriggerNoHelmet,
  onTriggerWrongWay,
  onTriggerCongestion,
  onTriggerPedestrianCrossing,
  onTriggerDangerousVehicle,
  onResetNormal,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950/90 backdrop-blur-lg border border-slate-800 shadow-2xl">
      {/* 1. SIMULATE ACCIDENT */}
      <button
        onClick={onTriggerAccident}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'ACCIDENT'
            ? 'bg-rose-600 text-white shadow-rose-600/40 ring-2 ring-rose-400'
            : 'bg-slate-900 text-rose-400 hover:bg-rose-950/60 border border-slate-800'
        }`}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>SIMULATE ACCIDENT</span>
      </button>

      {/* 2. SIMULATE OVERSPEED */}
      <button
        onClick={onTriggerOverspeed}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'OVERSPEED'
            ? 'bg-amber-500 text-slate-950 shadow-amber-500/40 ring-2 ring-amber-300'
            : 'bg-slate-900 text-amber-400 hover:bg-amber-950/60 border border-slate-800'
        }`}
      >
        <Gauge className="w-3.5 h-3.5" />
        <span>SIMULATE OVERSPEED</span>
      </button>

      {/* 3. SIMULATE NO HELMET */}
      <button
        onClick={onTriggerNoHelmet}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'NO_HELMET'
            ? 'bg-purple-600 text-white shadow-purple-600/40 ring-2 ring-purple-400'
            : 'bg-slate-900 text-purple-400 hover:bg-purple-950/60 border border-slate-800'
        }`}
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>SIMULATE NO HELMET</span>
      </button>

      {/* 4. SIMULATE WRONG WAY */}
      <button
        onClick={onTriggerWrongWay}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'WRONG_WAY'
            ? 'bg-rose-500 text-white shadow-rose-500/40 ring-2 ring-rose-300'
            : 'bg-slate-900 text-rose-300 hover:bg-rose-950/60 border border-slate-800'
        }`}
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>SIMULATE WRONG WAY</span>
      </button>

      {/* 5. SIMULATE CONGESTION */}
      <button
        onClick={onTriggerCongestion}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'CONGESTION'
            ? 'bg-sky-600 text-white shadow-sky-600/40 ring-2 ring-sky-400'
            : 'bg-slate-900 text-sky-400 hover:bg-sky-950/60 border border-slate-800'
        }`}
      >
        <Activity className="w-3.5 h-3.5" />
        <span>SIMULATE CONGESTION</span>
      </button>

      {/* 6. SIMULATE PEDESTRIAN CROSSING */}
      <button
        onClick={onTriggerPedestrianCrossing}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'PEDESTRIAN_CROSSING'
            ? 'bg-emerald-600 text-white shadow-emerald-600/40 ring-2 ring-emerald-300'
            : 'bg-slate-900 text-emerald-400 hover:bg-emerald-950/60 border border-slate-800'
        }`}
      >
        <Footprints className="w-3.5 h-3.5" />
        <span>SIMULATE PEDESTRIAN CROSSING</span>
      </button>

      {/* 7. SIMULATE DANGEROUS VEHICLE (INFLATABLE BARRIER) */}
      <button
        onClick={onTriggerDangerousVehicle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all shadow-md active:scale-95 ${
          currentMode === 'DANGEROUS_VEHICLE'
            ? 'bg-yellow-500 text-slate-950 shadow-yellow-500/40 ring-2 ring-yellow-300'
            : 'bg-slate-900 text-yellow-400 hover:bg-yellow-950/60 border border-slate-800'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>SIMULATE DANGEROUS VEHICLE</span>
      </button>

      {/* RESET TO NORMAL */}
      <button
        onClick={onResetNormal}
        title="Reset Traffic to Normal Flow"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-[11px] text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all active:scale-95"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>RESET</span>
      </button>
    </div>
  );
};
