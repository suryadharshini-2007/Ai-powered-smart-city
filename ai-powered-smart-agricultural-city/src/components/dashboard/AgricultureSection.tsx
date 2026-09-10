import React from 'react';
import { Link } from 'react-router-dom';
import {
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
  Sprout,
  Droplets,
  Thermometer,
  CloudRain,
  ShieldCheck,
  Plane,
  Scan,
  TrendingUp,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { MetricGauge } from './MetricGauge';

interface AgricultureSectionProps {
  cropHealthPercent: number;
  soilMoisturePercent: number;
  temperatureC: number;
  humidityPercent: number;
  irrigationStatus: string;
  diseaseRisk: string;
  droneStatus: string;
  plantsScanned: number;
  waterConsumptionLiters: number;
  agriculturalProductivityPercent: number;
  cropHealthHistory: { time: string; health: number; baseline: number }[];
  climateHistory: { time: string; temp: number; humidity: number }[];
}

export const AgricultureSection: React.FC<AgricultureSectionProps> = ({
  cropHealthPercent,
  soilMoisturePercent,
  temperatureC,
  humidityPercent,
  irrigationStatus,
  diseaseRisk,
  droneStatus,
  plantsScanned,
  waterConsumptionLiters,
  agriculturalProductivityPercent,
  cropHealthHistory,
  climateHistory,
}) => {
  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(16,185,129,0.15)] font-mono text-slate-100">
      {/* Header with Navigation Link to 3D Scene */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-widest">
              SECTOR 01 &bull; PRECISION AGRITECH
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              Smart Agricultural Cultivation & Greenhouse Telemetry
            </h2>
          </div>
        </div>

        <Link
          to="/zone/agriculture"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs transition-all font-semibold"
        >
          <span>Launch 3D Agriculture Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {/* Crop Health */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            Crop Health:
          </div>
          <div className="text-xl font-black text-emerald-400">
            {cropHealthPercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-emerald-300 mt-1 font-bold">Optimal Photosynthesis</div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            Soil Moisture:
          </div>
          <div className="text-xl font-black text-sky-300">
            {soilMoisturePercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-sky-400 mt-1">Capillary Volumetric</div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            Temperature:
          </div>
          <div className="text-xl font-black text-amber-300">
            {temperatureC.toFixed(1)} °C
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Climate Controlled</div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            Humidity:
          </div>
          <div className="text-xl font-black text-blue-300">
            {humidityPercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Target 70-75% RH</div>
        </div>

        {/* Irrigation Status */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Irrigation:
          </div>
          <div className="text-base font-black text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {irrigationStatus}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Automated Drip Loop</div>
        </div>

        {/* Disease Risk */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Disease Risk:
          </div>
          <div className="text-base font-black text-teal-300">{diseaseRisk}</div>
          <div className="text-[10px] text-emerald-400 mt-1">AI Pathogen Scan Clean</div>
        </div>
      </div>

      {/* Secondary Operational Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Drone Status */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Multispectral Drones:</div>
              <div className="text-xs font-bold text-white">{droneStatus} (Autonomous Waypoint Patrol)</div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500 font-bold">
            PATROL 04
          </span>
        </div>

        {/* Plants Scanned */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Plants Scanned Today:</div>
              <div className="text-sm font-black text-emerald-400">
                {plantsScanned.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">Crops</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">100% Covered</span>
        </div>

        {/* Agricultural Productivity */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Yield Productivity:</div>
              <div className="text-sm font-black text-teal-300">
                {agriculturalProductivityPercent.toFixed(1)}% <span className="text-[10px] font-normal text-slate-400">Yield</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">+18.4% vs Conventional</span>
        </div>
      </div>

      {/* Visual Analytics Grid:
          1. Soil Moisture Gauge + Irrigation Schedule
          2. Crop Health History Chart
          3. Climate (Temp vs Humidity) Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Soil Moisture Gauge & Dynamic Irrigation Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
            SOIL MOISTURE GAUGE
          </div>
          <MetricGauge
            value={soilMoisturePercent}
            label="Volumetric"
            unit="%"
            color="#38bdf8"
            size={130}
            sublabel="Target: 65% - 72%"
          />
          <div className="w-full mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Water Consumption:</span>
            <span className="font-bold text-sky-300">{waterConsumptionLiters.toLocaleString()} L/day</span>
          </div>
          <div className="w-full mt-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-400">Irrigation Zone:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Sub-surface Drip Auto
            </span>
          </div>
        </div>

        {/* Center: Crop Health Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              CROP HEALTH CHRONIC INDEX
            </span>
            <span className="text-[10px] text-slate-400">24-Hour Rolling</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cropHealthHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cropHealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="health"
                  name="Crop Health %"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cropHealthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Climate Timeline (Temp & Humidity) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              GREENHOUSE MICRO-CLIMATE
            </span>
            <span className="text-[10px] text-slate-400">Temp vs Humidity</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={climateHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
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
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  name="Temp (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
