import React from 'react';
import {
  Zap,
  Sun,
  BatteryCharging,
  Droplets,
  Lightbulb,
  Radio,
  Car,
  Video,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Play,
  TrendingUp,
  Activity,
  PlusCircle,
} from 'lucide-react';
import { InfrastructureMetrics } from './InfrastructureTypes';

interface InfrastructureHUDProps {
  metrics: InfrastructureMetrics;
  onCameraJump: (
    view:
      | 'overview'
      | 'streetlights'
      | 'cctv'
      | 'road'
      | 'solar'
      | 'water'
      | 'chargers'
      | 'poles'
  ) => void;
  onSimulateApproach: () => void;
  onToggleLeak: () => void;
  onBoostCharging: () => void;
  hasActiveLeak: boolean;
}

export const InfrastructureHUD: React.FC<InfrastructureHUDProps> = ({
  metrics,
  onCameraJump,
  onSimulateApproach,
  onToggleLeak,
  onBoostCharging,
  hasActiveLeak,
}) => {
  return (
    <>
      {/* Top Banner: Digital Infrastructure Dashboard Metrics */}
      <div className="absolute top-18 left-4 right-4 z-20 pointer-events-none flex flex-col gap-2">
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-indigo-500/70 p-3 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] font-mono text-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Header Title with Icon */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] text-indigo-400 uppercase font-extrabold tracking-wider">
                SMART INFRASTRUCTURE SYSTEM
              </div>
              <div className="text-xs font-bold text-white">Metropolitan Grid & Utilities Corridor</div>
            </div>
          </div>

          {/* Metric 1: Clean Power Generation */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Power Generation</div>
              <div className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {metrics.totalPowerGenerationKw} <span className="text-[10px] font-normal text-slate-400">kW</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Power Consumption */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Grid Draw</div>
              <div className="text-sm font-bold text-slate-200">
                {metrics.totalPowerConsumptionKw} <span className="text-[10px] text-slate-400">kW</span>
              </div>
            </div>
          </div>

          {/* Metric 3: BESS Storage */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">BESS Battery</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                {metrics.bessChargePercent}%
              </div>
            </div>
          </div>

          {/* Metric 4: Streetlights Active */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Smart Luminaires</div>
              <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                {metrics.streetlightsActive} Units
              </div>
            </div>
          </div>

          {/* Metric 5: Water Reserves */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Water Buffer</div>
              <div className="text-sm font-bold text-sky-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                {metrics.waterReservesLiters.toLocaleString()} L
              </div>
            </div>
          </div>

          {/* Metric 6: EV Fast Chargers */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Active EV Bays</div>
              <div className="text-sm font-bold text-purple-300 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-purple-400" />
                {metrics.evChargersOccupied} / 2 DC
              </div>
            </div>
          </div>

          {/* Metric 7: C-V2X Status */}
          <div className="flex items-center gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">C-V2X Network</div>
              <div className="text-sm font-bold text-teal-300 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                5G Low-Latency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Interactive Controller Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        {/* Left: Quick Camera Jumpers */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-300 mb-14">
          <span className="text-[10px] text-indigo-400 font-bold px-2 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            CAMERA VIEWS:
          </span>
          <button
            type="button"
            onClick={() => onCameraJump('overview')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('streetlights')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Smart Streetlight
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('cctv')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            AI CCTV & Safety
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('road')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Smart Road V2X
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('solar')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Solar & BESS
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('water')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Water Facility
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('chargers')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            EV Hyper-Charging
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('poles')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            5G Smart Pole
          </button>
        </div>

        {/* Right: Interactive Trigger Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Approach Simulation */}
          <button
            type="button"
            onClick={onSimulateApproach}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold shadow-xl border border-amber-400 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Lightbulb className="w-4 h-4" />
            <span>APPROACH (RAMP LIGHTS)</span>
          </button>

          {/* Leak Detection Toggle */}
          <button
            type="button"
            onClick={onToggleLeak}
            className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold shadow-xl border transition-all flex items-center gap-1.5 active:scale-95 ${
              hasActiveLeak
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400'
                : 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{hasActiveLeak ? 'RESOLVE LEAK' : 'TEST LEAK SENSING'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
