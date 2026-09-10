import React from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  GraduationCap,
  Bot,
  Sun,
  Laptop,
  Trophy,
  Trees,
  Zap,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface SchoolSectionProps {
  studentsCount: number;
  aiRobotsCount: number;
  solarGenerationKw: number;
  smartClassroomsCount: number;
  sportsFacilitiesCount: number;
  greenCampusRating: string;
  energyConsumptionKw: number;
  campusEnergyHistory: { hour: string; solar: number; consumption: number }[];
}

export const SchoolSection: React.FC<SchoolSectionProps> = ({
  studentsCount,
  aiRobotsCount,
  solarGenerationKw,
  smartClassroomsCount,
  sportsFacilitiesCount,
  greenCampusRating,
  energyConsumptionKw,
  campusEnergyHistory,
}) => {
  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(6,182,212,0.15)] font-mono text-slate-100">
      {/* Header with Navigation Link to 3D Scene */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-cyan-400 uppercase font-extrabold tracking-widest">
              SECTOR 04 &bull; AGRITECH EDUCATION
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              Futuristic Green Campus, AI Tutors & Kinetic Sports Arenas
            </h2>
          </div>
        </div>

        <Link
          to="/zone/school"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs transition-all font-semibold"
        >
          <span>Launch 3D School Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {/* Students */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Students:
          </div>
          <div className="text-xl font-black text-white">{studentsCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">100% Digital Curriculum</div>
        </div>

        {/* AI Robots */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            AI Robots:
          </div>
          <div className="text-xl font-black text-sky-300">{aiRobotsCount} Units</div>
          <div className="text-[10px] text-sky-400 mt-1">Tutors & Science Labs</div>
        </div>

        {/* Solar Generation */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Solar Generation:
          </div>
          <div className="text-xl font-black text-amber-400">
            {solarGenerationKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Rooftop Perovskite</div>
        </div>

        {/* Smart Classrooms */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Laptop className="w-3.5 h-3.5 text-teal-400" />
            Smart Classrooms:
          </div>
          <div className="text-xl font-black text-teal-300">{smartClassroomsCount} Labs</div>
          <div className="text-[10px] text-slate-400 mt-1">Holographic Pods</div>
        </div>

        {/* Sports Facilities */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            Sports Facilities:
          </div>
          <div className="text-xl font-black text-amber-300">{sportsFacilitiesCount} Arenas</div>
          <div className="text-[10px] text-teal-400 mt-1">Kinetic Power Tiles</div>
        </div>

        {/* Green Campus */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            Green Campus:
          </div>
          <div className="text-base font-black text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
            {greenCampusRating}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Zero Carbon Footprint</div>
        </div>

        {/* Energy Consumption */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Energy Consumption:
          </div>
          <div className="text-xl font-black text-purple-300">
            {energyConsumptionKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Net Exporter +13.5 kW</div>
        </div>
      </div>

      {/* Campus Solar Generation vs Energy Draw Timeline Chart */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            CAMPUS CLEAN SOLAR PRODUCTION VS CONSUMPTION
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">100% OFF-GRID SUSTAINABLE</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={campusEnergyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="schoolSolarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="schoolConsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Area
                type="monotone"
                dataKey="solar"
                name="Solar Output (kW)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#schoolSolarGrad)"
              />
              <Area
                type="monotone"
                dataKey="consumption"
                name="Campus Draw (kW)"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#schoolConsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
