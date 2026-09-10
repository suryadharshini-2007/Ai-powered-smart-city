import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Footprints,
  Cpu,
  Building2,
  BatteryCharging,
  Zap,
  ArrowRight,
  TrendingUp,
  Activity,
  Globe,
  Share2,
} from 'lucide-react';

interface EnergyFlowProps {
  solarGenerationKw: number;
  footstepEnergyKj: number;
  cityConsumptionKw: number;
  batteryLevelPercent: number;
  gridUsageKw: number;
}

export const EnergyFlowDiagram: React.FC<EnergyFlowProps> = ({
  solarGenerationKw,
  footstepEnergyKj,
  cityConsumptionKw,
  batteryLevelPercent,
  gridUsageKw,
}) => {
  const netExportKw = (solarGenerationKw - cityConsumptionKw).toFixed(1);

  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(14,165,233,0.15)] font-mono text-slate-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400 uppercase font-extrabold tracking-widest">
              ENERGY DISTRIBUTION & FLOW
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              Decentralized Renewable Microgrid Telemetry
            </h2>
          </div>
        </div>

        <Link
          to="/zone/infrastructure"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-sky-500/30 text-xs transition-all font-semibold"
        >
          <span>View 3D Infrastructure Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Numeric KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {/* Solar Generation */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Solar Generation:
          </div>
          <div className="text-xl font-black text-amber-400">
            {solarGenerationKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+4.2% vs baseline</span>
          </div>
        </div>

        {/* Footstep Energy */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Footprints className="w-3.5 h-3.5 text-teal-400" />
            Footstep Energy:
          </div>
          <div className="text-xl font-black text-teal-300">
            {footstepEnergyKj.toFixed(1)} <span className="text-xs font-normal text-slate-400">kJ</span>
          </div>
          <div className="text-[10px] text-teal-400 mt-1">Kinetic Harvesting</div>
        </div>

        {/* City Consumption */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            City Consumption:
          </div>
          <div className="text-xl font-black text-white">
            {cityConsumptionKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total Municipal Draw</div>
        </div>

        {/* Battery Level */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            Battery Level:
          </div>
          <div className="text-xl font-black text-emerald-400">
            {Math.round(batteryLevelPercent)}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${batteryLevelPercent}%` }}
            />
          </div>
        </div>

        {/* Grid Usage / Net Export */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Grid Usage:
          </div>
          <div className="text-xl font-black text-purple-300">
            {netExportKw} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-bold">
            100% Clean Net Exporter
          </div>
        </div>
      </div>

      {/* Required Prompt Specification:
          Add an energy flow visualization:
          SOLAR
          +
          FOOTSTEP ENERGY
          → SMART GRID
          → CITY */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-800 relative overflow-hidden">
        <div className="text-xs text-sky-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-sky-400" />
          <span>Real-Time Animated Energy Flow Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Node 1: Inputs (Solar + Footstep) */}
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/40 relative group hover:border-amber-400 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Sun className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">SOLAR GENERATION</div>
                    <div className="text-[11px] text-slate-400">Bifacial PV Canopies</div>
                  </div>
                </div>
                <span className="text-base font-black text-amber-400">{solarGenerationKw.toFixed(1)} kW</span>
              </div>
            </div>

            <div className="text-center font-black text-slate-500 text-sm tracking-widest">+</div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/40 relative group hover:border-teal-400 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                    <Footprints className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">FOOTSTEP ENERGY</div>
                    <div className="text-[11px] text-slate-400">Kinetic Boardwalk Tiles</div>
                  </div>
                </div>
                <span className="text-base font-black text-teal-300">{footstepEnergyKj.toFixed(1)} kJ</span>
              </div>
            </div>
          </div>

          {/* Center Connector / Confluence Arrow & Smart Grid Node */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] text-center relative">
            {/* Pulsing Glow Ring */}
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-2 border border-indigo-500/40 animate-pulse">
              <Cpu className="w-8 h-8" />
            </div>
            <div className="text-xs text-indigo-400 font-extrabold uppercase tracking-wider">
              CENTRAL CONFLUENCE
            </div>
            <div className="text-lg font-black text-white font-heading mt-0.5">
              SMART GRID CONTROLLER
            </div>
            <div className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Active frequency regulation (50.00 Hz) & BESS Vault Storage ({Math.round(batteryLevelPercent)}%)
            </div>

            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              MICROGRID AUTONOMOUS
            </div>
          </div>

          {/* Node 3: Outputs (City Consumption & Export) */}
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-sky-500/40 relative group hover:border-sky-400 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">CITY DEMAND</div>
                    <div className="text-[11px] text-slate-400">Agriculture, School, Market</div>
                  </div>
                </div>
                <span className="text-base font-black text-sky-300">{cityConsumptionKw.toFixed(1)} kW</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-purple-500/40 relative group hover:border-purple-400 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">NET GRID EXPORT</div>
                    <div className="text-[11px] text-slate-400">Surplus Outflow to State Grid</div>
                  </div>
                </div>
                <span className="text-base font-black text-purple-300">+{netExportKw} kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
