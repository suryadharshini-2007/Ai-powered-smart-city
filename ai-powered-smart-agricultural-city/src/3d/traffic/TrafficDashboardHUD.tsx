import React from 'react';
import {
  Car,
  AlertTriangle,
  ShieldCheck,
  Radio,
  Building2,
  Ambulance as AmbulanceIcon,
  Activity,
  Footprints,
  Clock,
  Eye,
  Zap,
} from 'lucide-react';
import {
  TrafficStateMode,
  AccidentTelemetry,
  PedestrianCrossingState,
  InflatableBarrierState,
} from './TrafficTypes';

interface TrafficDashboardHUDProps {
  trafficState: TrafficStateMode;
  accidentState: AccidentTelemetry;
  crossingState: PedestrianCrossingState;
  barrierState: InflatableBarrierState;
  vehicleCount: number;
  violationCount: number;
  accidentCount: number;
}

export const TrafficDashboardHUD: React.FC<TrafficDashboardHUDProps> = ({
  trafficState,
  accidentState,
  crossingState,
  barrierState,
  vehicleCount,
  violationCount,
  accidentCount,
}) => {
  // Communication chain step labels
  const commSteps = [
    { label: 'DRONE', icon: Radio, stepId: 1 },
    { label: 'AI TRAFFIC SYSTEM', icon: Activity, stepId: 2 },
    { label: 'CONTROL CENTER', icon: Building2, stepId: 3 },
    { label: 'HOSPITAL', icon: AlertTriangle, stepId: 4 },
    { label: 'AMBULANCE', icon: AmbulanceIcon, stepId: 5 },
  ];

  return (
    <div className="pointer-events-none w-full flex flex-col gap-3">
      {/* 1. TOP METRICS DASHBOARD STRIP */}
      <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-mono">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-xl">
          {/* Vehicles Detected */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Car className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px] text-slate-400">Vehicles:</span>
            <span className="font-bold text-white tracking-wide">
              {vehicleCount.toLocaleString()}
            </span>
          </div>

          {/* Violations Today */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-400">Violations:</span>
            <span className="font-bold text-amber-300">{violationCount}</span>
          </div>

          {/* Accidents Detected */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] text-slate-400">Accidents:</span>
            <span className="font-bold text-rose-300">{accidentCount}</span>
          </div>

          {/* Drones Active */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400">Drones:</span>
            <span className="font-bold text-emerald-400">6 Active</span>
          </div>

          {/* Pedestrian Safety Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px]">Pedestrian Safety:</span>
            <span className="text-emerald-300 tracking-wider">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 2. ACCIDENT NOTIFICATION & COMMUNICATION PATHWAY OVERLAY */}
      {accidentState.detected && (
        <div className="pointer-events-auto w-full max-w-2xl mx-auto bg-slate-950/95 backdrop-blur-lg border border-rose-500/80 rounded-2xl p-3.5 shadow-2xl shadow-rose-950/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-wrap items-center justify-between border-b border-rose-900/60 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="font-mono font-black text-rose-400 tracking-wider text-sm sm:text-base">
                ACCIDENT DETECTED
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-slate-400">
                Location: <strong className="text-white">Central Junction</strong>
              </span>
              <span className="text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                Severity: HIGH
              </span>
              <span className="text-sky-300">
                AI Confidence: <strong>97%</strong>
              </span>
              <span className="text-emerald-400 font-bold">
                Emergency Alert: SENT
              </span>
            </div>
          </div>

          {/* Animated 5-Step Communication Path: DRONE → AI TRAFFIC SYSTEM → CONTROL CENTER → HOSPITAL → AMBULANCE */}
          <div className="mt-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
              <span>Automated Emergency Relay Protocol</span>
              <span className="text-emerald-400 font-semibold animate-pulse">
                CORRIDOR PREEMPTION ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {commSteps.map((node, i) => {
                const isStepActive = accidentState.commStep >= node.stepId;
                const IconComp = node.icon;
                return (
                  <div
                    key={node.label}
                    className={`relative p-2 rounded-xl text-center border transition-all duration-300 flex flex-col items-center justify-center ${
                      isStepActive
                        ? 'bg-rose-950/70 border-rose-500 text-white shadow-lg shadow-rose-900/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 mb-1 ${
                        isStepActive ? 'text-rose-400 animate-pulse' : 'text-slate-500'
                      }`}
                    />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-tight block truncate w-full">
                      {node.label}
                    </span>
                    {i < commSteps.length - 1 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 z-10 text-[10px]">
                        ➔
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. PEDESTRIAN SAFETY GATES CROSSING STAGE TRACKER */}
      {crossingState.active && (
        <div className="pointer-events-auto w-full max-w-2xl mx-auto bg-slate-950/95 backdrop-blur-lg border border-sky-500/80 rounded-2xl p-3 shadow-xl animate-in fade-in slide-in-from-top-3 duration-300 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                AUTOMATIC PEDESTRIAN SAFETY GATES &bull; INTERLOCK IN PROGRESS
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              STAGE {crossingState.step} OF 9
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-300">
            <span className={crossingState.step >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              1. Detection
            </span>
            <span>➔</span>
            <span className={crossingState.step >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              2. Vehicles Slow
            </span>
            <span>➔</span>
            <span className={crossingState.step >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              3. Signal Red
            </span>
            <span>➔</span>
            <span className={crossingState.step >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              4. Gates Close
            </span>
            <span>➔</span>
            <span className={crossingState.step >= 5 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              5. Pedestrian Walk
            </span>
            <span>➔</span>
            <span className={crossingState.step >= 8 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              8. Gates Reopen
            </span>
          </div>
        </div>
      )}

      {/* 4. INFLATABLE BARRIER ALERT BANNER */}
      {barrierState.impactRisk && (
        <div className="pointer-events-auto w-full max-w-xl mx-auto bg-slate-950/95 backdrop-blur-lg border border-amber-500/80 rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-xs font-bold text-amber-400 uppercase">
                {barrierState.status === 'ACTIVATING'
                  ? 'IMPACT RISK DETECTED • BARRIER ACTIVATING'
                  : 'SAFETY BARRIER ACTIVE • IMPACT DEFLECTED'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              PEDESTRIAN SAFETY: PROTECTED
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
