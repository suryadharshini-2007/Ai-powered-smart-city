import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  Sun,
  Navigation,
  Droplets,
  Radio,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Zap,
  Waves,
} from 'lucide-react';

interface InfrastructureSectionProps {
  smartStreetlightsCount: number;
  streetlightsEnergySavedPercent: number;
  renewableEnergyPercent: number;
  smartRoadsKm: number;
  waterReservesLiters: number;
  waterRecycledPercent: number;
  communicationStatus: string;
  publicSafetyIndex: string;
  gridFrequencyHz: number;
}

export const InfrastructureSection: React.FC<InfrastructureSectionProps> = ({
  smartStreetlightsCount,
  streetlightsEnergySavedPercent,
  renewableEnergyPercent,
  smartRoadsKm,
  waterReservesLiters,
  waterRecycledPercent,
  communicationStatus,
  publicSafetyIndex,
  gridFrequencyHz,
}) => {
  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(59,130,246,0.15)] font-mono text-slate-100">
      {/* Header with Navigation Link to 3D Scene */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-blue-400 uppercase font-extrabold tracking-widest">
              SECTOR 06 &bull; MUNICIPAL GRID & UTILITIES
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              Smart Streetlights, Acoustic Water Management & 5G Poles
            </h2>
          </div>
        </div>

        <Link
          to="/zone/infrastructure"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 hover:text-blue-200 border border-blue-500/40 text-xs transition-all font-semibold"
        >
          <span>Launch 3D Infrastructure Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Required Prompt Display Specs:
          - Smart Streetlights
          - Renewable Energy
          - Smart Roads
          - Water Management
          - Communication Systems
          - Public Safety
          - Energy Monitoring */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Smart Streetlights */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Smart Streetlights:
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-500">
              ADAPTIVE AUTO
            </span>
          </div>
          <div className="text-2xl font-black text-amber-300">
            {smartStreetlightsCount} <span className="text-xs font-normal text-slate-400">Luminaires</span>
          </div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{streetlightsEnergySavedPercent}% Energy Saved via Radar Dimming</span>
          </div>
        </div>

        {/* 2. Renewable Energy */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              Renewable Energy:
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500">
              100% CLEAN
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {renewableEnergyPercent}%
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Solar PV + Kinetic Harvesters + BESS Vault
          </div>
        </div>

        {/* 3. Smart Roads */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-400" />
              Smart Roads:
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 font-bold border border-sky-500">
              C-V2X ACTIVE
            </span>
          </div>
          <div className="text-2xl font-black text-sky-300">
            {smartRoadsKm.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Piezoelectric Strain + Dynamic Inductive Charging
          </div>
        </div>

        {/* 4. Water Management */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Water Management:
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-500">
              0 LEAKS
            </span>
          </div>
          <div className="text-2xl font-black text-blue-300">
            {waterReservesLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">L</span>
          </div>
          <div className="text-xs text-teal-300 mt-2 flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-teal-400" />
            <span>{waterRecycledPercent}% Closed-Loop Recycled</span>
          </div>
        </div>
      </div>

      {/* Bottom Infrastructure Systems Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 5. Communication Systems */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Communication Systems:</div>
              <div className="text-xs font-bold text-white mt-0.5">{communicationStatus}</div>
            </div>
          </div>
          <span className="text-[10px] text-teal-300 font-bold">1.8 ms</span>
        </div>

        {/* 6. Public Safety */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Public Safety:</div>
              <div className="text-xs font-bold text-white mt-0.5">{publicSafetyIndex}</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Optimal</span>
        </div>

        {/* 7. Energy Monitoring */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Energy Monitoring:</div>
              <div className="text-xs font-bold text-white mt-0.5">Grid Frequency: {gridFrequencyHz.toFixed(2)} Hz</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Balanced</span>
        </div>
      </div>
    </div>
  );
};
