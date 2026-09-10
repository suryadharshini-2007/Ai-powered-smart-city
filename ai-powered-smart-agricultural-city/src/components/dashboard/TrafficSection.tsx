import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Car,
  AlertTriangle,
  ShieldCheck,
  Plane,
  Eye,
  ArrowRight,
  Activity,
  CheckCircle2,
  Bell,
  DoorClosed,
} from 'lucide-react';

interface TrafficSectionProps {
  vehiclesDetected: number;
  violationsToday: number;
  accidentsDetected: number;
  dronesActive: number;
  pedestrianSafety: string;
  safetyGates: string;
  emergencyResponse: string;
  trafficVolumeHistory: { hour: string; vehicles: number; speed: number }[];
  violationsHistory: { category: string; count: number }[];
}

export const TrafficSection: React.FC<TrafficSectionProps> = ({
  vehiclesDetected,
  violationsToday,
  accidentsDetected,
  dronesActive,
  pedestrianSafety,
  safetyGates,
  emergencyResponse,
  trafficVolumeHistory,
  violationsHistory,
}) => {
  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(245,158,11,0.15)] font-mono text-slate-100">
      {/* Header with Navigation Link to 3D Scene */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400 uppercase font-extrabold tracking-widest">
              SECTOR 02 &bull; AUTONOMOUS MOBILITY
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              C-V2X Intelligent Traffic, AI Radar & Pedestrian Safety
            </h2>
          </div>
        </div>

        <Link
          to="/zone/traffic"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs transition-all font-semibold"
        >
          <span>Launch 3D Traffic Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {/* Vehicles Detected */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Car className="w-3.5 h-3.5 text-sky-400" />
            Vehicles Detected:
          </div>
          <div className="text-xl font-black text-sky-300">
            {vehiclesDetected.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Active on Corridor</div>
        </div>

        {/* Violations Today */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Violations Today:
          </div>
          <div className="text-xl font-black text-amber-400">
            {violationsToday}
          </div>
          <div className="text-[10px] text-amber-300 mt-1">Automated E-Challan</div>
        </div>

        {/* Accidents Detected */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            Accidents Detected:
          </div>
          <div className="text-xl font-black text-rose-400">
            {accidentsDetected}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-bold">0 Fatalities</div>
        </div>

        {/* Drones Active */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Plane className="w-3.5 h-3.5 text-teal-400" />
            Drones Active:
          </div>
          <div className="text-xl font-black text-teal-300">
            {dronesActive}
          </div>
          <div className="text-[10px] text-teal-400 mt-1">Aerial Grid Patrol</div>
        </div>

        {/* Pedestrian Safety */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Pedestrian Safety:
          </div>
          <div className="text-base font-black text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {pedestrianSafety}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">AI Crosswalk Radar</div>
        </div>

        {/* Safety Gates */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <DoorClosed className="w-3.5 h-3.5 text-indigo-400" />
            Safety Gates:
          </div>
          <div className="text-base font-black text-indigo-300 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            {safetyGates}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Active Hydraulic Lock</div>
        </div>

        {/* Emergency Response */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Emergency Response:
          </div>
          <div className="text-base font-black text-purple-300 flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            {emergencyResponse}
          </div>
          <div className="text-[10px] text-purple-400 mt-1">Sub-90s Rapid Unit</div>
        </div>
      </div>

      {/* Required Prompt Charts:
          - Traffic volume
          - Violations
          - Accidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Traffic Volume Flow Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              TRAFFIC VOLUME (HOURLY DENSITY)
            </span>
            <span className="text-[10px] text-slate-400">Flow vs Avg Speed</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficVolumeHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficVolGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #38bdf8',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vehicles"
                  name="Vehicles/hr"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#trafficVolGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Violations Breakdown Bar Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              VIOLATIONS CLASSIFICATION
            </span>
            <span className="text-[10px] text-slate-400">Today's Recorded</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" name="Violations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Accidents & Critical Incidents Log Panel */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                ACCIDENTS & SAFETY AUDIT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500">
                100% CONTAINED
              </span>
            </div>

            <div className="space-y-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>Incident #01: Low-Speed Scraping</span>
                  <span className="text-[10px] text-slate-400">08:14 UTC</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Autonomous delivery pod clipped parking kerb. V2X drone dispatched in 42s. Cleared in 4 mins.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>Incident #02: Tyre Debris Anomaly</span>
                  <span className="text-[10px] text-slate-400">11:32 UTC</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Highway strain sensor detected debris at Junction 4A. Robotic sweeper auto-deployed.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Pedestrian Injury Rate:</span>
            <span className="font-bold text-emerald-400">0.00% Zero Vision Goal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
