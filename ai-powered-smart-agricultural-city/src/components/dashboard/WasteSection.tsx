import React from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Trash2,
  Bot,
  Recycle,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { MetricGauge } from './MetricGauge';

interface WasteSectionProps {
  wasteCollectedKg: number;
  smartBinsCount: number;
  averageFillLevelPercent: number;
  recyclingRatePercent: number;
  organicWastePercent: number;
  plasticWastePercent: number;
  collectionRobotsCount: number;
  segregationData: { name: string; value: number; color: string }[];
}

export const WasteSection: React.FC<WasteSectionProps> = ({
  wasteCollectedKg,
  smartBinsCount,
  averageFillLevelPercent,
  recyclingRatePercent,
  organicWastePercent,
  plasticWastePercent,
  collectionRobotsCount,
  segregationData,
}) => {
  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(20,184,166,0.15)] font-mono text-slate-100">
      {/* Header with Navigation Link to 3D Scene */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-teal-400 uppercase font-extrabold tracking-widest">
              SECTOR 05 &bull; CIRCULAR BIO-ECONOMY
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              Smart IoT Waste Bins, AI Sorting & Autonomous Collection
            </h2>
          </div>
        </div>

        <Link
          to="/zone/waste"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900/80 text-teal-300 hover:text-teal-200 border border-teal-500/40 text-xs transition-all font-semibold"
        >
          <span>Launch 3D Waste Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {/* Waste Collected */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Trash2 className="w-3.5 h-3.5 text-teal-400" />
            Waste Collected:
          </div>
          <div className="text-xl font-black text-white">
            {wasteCollectedKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">This Week Total</div>
        </div>

        {/* Smart Bins */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Smart Bins:
          </div>
          <div className="text-xl font-black text-sky-300">{smartBinsCount} Units</div>
          <div className="text-[10px] text-sky-400 mt-1">Ultrasonic Sensor Mesh</div>
        </div>

        {/* Average Fill Level */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Recycle className="w-3.5 h-3.5 text-amber-400" />
            Avg Fill Level:
          </div>
          <div className="text-xl font-black text-amber-400">
            {Math.round(averageFillLevelPercent)}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Optimal Dispatch Range</div>
        </div>

        {/* Recycling Rate */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            Recycling Rate:
          </div>
          <div className="text-xl font-black text-emerald-400">
            {recyclingRatePercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-emerald-300 mt-1">Closed-Loop Metric</div>
        </div>

        {/* Organic Waste */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Organic Waste:
          </div>
          <div className="text-xl font-black text-emerald-300">
            {organicWastePercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Bio-Gas & Compost</div>
        </div>

        {/* Plastic Waste */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Recycle className="w-3.5 h-3.5 text-blue-400" />
            Plastic Waste:
          </div>
          <div className="text-xl font-black text-blue-300">
            {plasticWastePercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Pellet Extrusion</div>
        </div>

        {/* Collection Robots */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            Collection Robots:
          </div>
          <div className="text-xl font-black text-purple-300">
            {collectionRobotsCount} Active
          </div>
          <div className="text-[10px] text-purple-400 mt-1">Sub-90s Bin Pickup</div>
        </div>
      </div>

      {/* Visual Analytics:
          1. Average Fill Level Gauge
          2. Segregation Breakdown Pie / Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Fill Level Gauge */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
            MUNICIPAL BIN FILL CAPACITY
          </div>
          <MetricGauge
            value={averageFillLevelPercent}
            label="Average Load"
            unit="%"
            color="#14b8a6"
            size={130}
            sublabel="Auto-dispatch threshold: 75%"
          />
          <div className="w-full mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Critical Bins (&gt;80%):</span>
            <span className="font-bold text-emerald-400">0 Bins (All Cleared)</span>
          </div>
        </div>

        {/* Center & Right: Waste Segregation Stream Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              AI AUTOMATED SEGREGATION COMPOSITION
            </span>
            <span className="text-[10px] text-slate-400">Multi-Spectral Optical Sorter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segregationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {segregationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #14b8a6',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {segregationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
