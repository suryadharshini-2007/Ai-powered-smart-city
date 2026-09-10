import React from 'react';
import {
  Recycle,
  Trash2,
  Cpu,
  Bot,
  Truck,
  Leaf,
  Boxes,
  FileText,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Play,
  RotateCw,
  Eye,
  Layers,
} from 'lucide-react';
import { WasteMetrics, SmartBinData, CollectionRobotStage } from './WasteTypes';

interface WasteDashboardHUDProps {
  metrics: WasteMetrics;
  onUpdateMetrics: (deltaKg: number) => void;
  onCameraJump: (view: 'overview' | 'bins' | 'segregation' | 'robot' | 'organic' | 'recycling' | 'station') => void;
  onTriggerRobotDispatch: () => void;
  robotStage: CollectionRobotStage;
  bins: SmartBinData[];
  onSelectBin: (bin: SmartBinData) => void;
}

export const WasteDashboardHUD: React.FC<WasteDashboardHUDProps> = ({
  metrics,
  onUpdateMetrics,
  onCameraJump,
  onTriggerRobotDispatch,
  robotStage,
  bins,
  onSelectBin,
}) => {
  return (
    <>
      {/* Top Banner: Digital Waste Dashboard Metrics */}
      <div className="absolute top-18 left-4 right-4 z-20 pointer-events-none flex flex-col gap-2">
        {/* Main KPI Bar */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-teal-500/70 p-3 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.3)] font-mono text-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Header Title with Icon */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] text-teal-400 uppercase font-extrabold tracking-wider">
                DIGITAL WASTE DASHBOARD
              </div>
              <div className="text-xs font-bold text-white">Smart Agricultural City Zone 3E</div>
            </div>
          </div>

          {/* Metric 1: Waste Collected Today */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Waste Collected Today</div>
              <div className="text-sm font-black text-teal-300">
                {metrics.wasteCollectedTodayKg.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">kg</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Recycling Rate */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Recycling Rate</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                {metrics.recyclingRatePercent}%
              </div>
            </div>
          </div>

          {/* Metric 3: Organic Waste */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Organic Waste</div>
              <div className="text-sm font-bold text-slate-200">
                {metrics.organicWasteKg.toLocaleString()} <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Plastic Waste */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Plastic Waste</div>
              <div className="text-sm font-bold text-slate-200">
                {metrics.plasticWasteKg.toLocaleString()} <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>
          </div>

          {/* Metric 5: Paper Waste */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Paper Waste</div>
              <div className="text-sm font-bold text-slate-200">
                {metrics.paperWasteKg.toLocaleString()} <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>
          </div>

          {/* Metric 6: Active Collection Robots */}
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Active Robots</div>
              <div className="text-sm font-black text-purple-300 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                {metrics.activeCollectionRobots} Units
              </div>
            </div>
          </div>

          {/* Simulated Value Update Action */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onUpdateMetrics(50)}
              className="px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-3 h-3" />
              SIMULATE INTAKE (+50 kg)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Interactive Controller Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        {/* Left: Quick Camera Jumpers */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-300 mb-14">
          <span className="text-[10px] text-teal-400 font-bold px-2 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            ZONE VIEWS:
          </span>
          <button
            type="button"
            onClick={() => onCameraJump('overview')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Full Zone
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('bins')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Smart Bins
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('segregation')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            AI Sorting Line
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('robot')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Collection Robot
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('organic')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Bio-Digester
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('recycling')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Plastic & Paper
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('station')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            AI SCADA Station
          </button>
        </div>

        {/* Right: Quick Triggers */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Dispatch Robot */}
          <button
            type="button"
            onClick={onTriggerRobotDispatch}
            disabled={robotStage !== 'IDLE' && robotStage !== 'COMPLETED'}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-xl border border-amber-400 transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>
              {robotStage === 'IDLE' || robotStage === 'COMPLETED'
                ? 'DISPATCH COLLECTION ROBOT'
                : `ROBOT: ${robotStage.replace('_', ' ')}`}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
