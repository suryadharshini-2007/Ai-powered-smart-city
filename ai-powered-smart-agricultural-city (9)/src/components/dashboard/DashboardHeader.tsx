import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  MapPin,
  Clock,
  Home,
  Sprout,
  Car,
  GraduationCap,
  ShoppingBag,
  Trash2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface DashboardHeaderProps {
  selectedCity: string;
  lastUpdated: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedCity,
  lastUpdated,
}) => {
  const location = useLocation();

  const navLinks = [
    { label: 'HOME (3D CITY)', to: '/city', icon: Home, color: 'text-indigo-400' },
    { label: 'AGRICULTURE', to: '/zone/agriculture', icon: Sprout, color: 'text-emerald-400' },
    { label: 'TRAFFIC', to: '/zone/traffic', icon: Car, color: 'text-amber-400' },
    { label: 'SCHOOL', to: '/zone/school', icon: GraduationCap, color: 'text-cyan-400' },
    { label: 'MARKET', to: '/zone/market', icon: ShoppingBag, color: 'text-rose-400' },
    { label: 'WASTE', to: '/zone/waste', icon: Trash2, color: 'text-teal-400' },
    { label: 'INFRASTRUCTURE', to: '/zone/infrastructure', icon: Zap, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="bg-slate-950/85 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_40px_rgba(14,165,233,0.15)] text-slate-100 font-mono">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Title & City Info */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
                CENTRAL TELEMETRY ENGINE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Current System Status: ONLINE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-heading">
              AI-POWERED SMART AGRICULTURAL CITY
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 text-sky-300 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Selected City:</span>
                <span className="font-bold text-white text-base">{selectedCity}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last Updated:</span>
                <span className="font-bold text-slate-200">{lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Quick Access to Master 3D View */}
          <div className="flex items-center gap-3">
            <Link
              to="/city"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-heading font-black text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(56,189,248,0.35)] active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>EXPLORE 3D MASTER CITY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Futuristic Navigation Bar (Direct Links to 3D Environments) */}
      <div className="bg-slate-950/75 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 shadow-lg">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
          <span>JUMP DIRECTLY INTO INTERACTIVE 3D SECTORS:</span>
          <span className="text-emerald-400 font-bold">ALL 6 ZONES CONNECTED</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 transition-all font-mono text-xs text-slate-300 hover:text-white shadow-sm"
              >
                <Icon className={`w-3.5 h-3.5 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="truncate font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
