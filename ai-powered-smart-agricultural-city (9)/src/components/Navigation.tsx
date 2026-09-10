import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sprout,
  Activity,
  Layers,
  ChevronDown,
  Cpu,
  Car,
  GraduationCap,
  Store,
  Recycle,
  Zap,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';

export const Navigation: React.FC = () => {
  const [zonesOpen, setZonesOpen] = useState(false);
  const location = useLocation();
  const { user, selectedCity } = useAuth();

  const zones = [
    { name: 'Agriculture Biosphere', path: '/zone/agriculture', icon: Sprout, color: 'text-emerald-400' },
    { name: 'Smart Transit & Drones', path: '/zone/traffic', icon: Car, color: 'text-sky-400' },
    { name: 'Agri-Tech Academy', path: '/zone/school', icon: GraduationCap, color: 'text-purple-400' },
    { name: 'Algorithmic Bio-Market', path: '/zone/market', icon: Store, color: 'text-amber-400' },
    { name: 'Circular Bio-Refinery', path: '/zone/waste', icon: Recycle, color: 'text-teal-400' },
    { name: 'Hydro & Heliostat Spine', path: '/zone/infrastructure', icon: Zap, color: 'text-indigo-400' },
  ];

  const isZoneActive = location.pathname.startsWith('/zone');

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <NavLink
          to="/city"
          id="nav-brand-link"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                SMART AGRI-CITY
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium border border-emerald-500/30">
                  AI v2.6
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block truncate max-w-[200px]">
              {selectedCity || 'AeroAgri'} &bull; Biosphere OS
            </p>
          </div>
        </NavLink>

        {/* Primary Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Master 3D City */}
          <NavLink
            to="/city"
            id="nav-link-master-city"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`
            }
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>3D City</span>
          </NavLink>

          {/* Zones Dropdown */}
          <div className="relative">
            <button
              id="nav-btn-zones-dropdown"
              type="button"
              onClick={() => setZonesOpen(!zonesOpen)}
              onBlur={() => setTimeout(() => setZonesOpen(false), 200)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isZoneActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Zone Scenes</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  zonesOpen ? 'rotate-180 text-sky-400' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {zonesOpen && (
              <div
                id="nav-dropdown-menu"
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-2 shadow-2xl z-50"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Modular 3D Zone Scenes
                </div>
                <div className="space-y-0.5">
                  {zones.map((zone) => {
                    const Icon = zone.icon;
                    return (
                      <NavLink
                        key={zone.path}
                        to={zone.path}
                        onClick={() => setZonesOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-slate-800 text-white font-semibold'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                          }`
                        }
                      >
                        <Icon className={`w-4 h-4 ${zone.color}`} />
                        <span>{zone.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Analytics Dashboard */}
          <NavLink
            to="/dashboard"
            id="nav-link-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`
            }
          >
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </NavLink>

          {/* Login / Setup */}
          <NavLink
            to="/login"
            id="nav-link-login-setup"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`
            }
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Setup & Access</span>
            <span className="md:hidden">Setup</span>
          </NavLink>
        </nav>

        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grid Online</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">98.2% AI Health</span>
          </div>
          <StatusBadge status="optimal" size="sm" />
        </div>
      </div>
    </header>
  );
};
