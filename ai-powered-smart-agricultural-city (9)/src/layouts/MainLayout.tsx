import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../components/Navigation';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060b0f] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <Navigation />
      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>
      <footer className="py-4 px-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI-POWERED SMART AGRICULTURAL CITY SYSTEM &bull; v2.6.0 PROTOTYPE</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Three.js + R3F + React 19</span>
          <span>REST / Express / MongoDB Architecture</span>
        </div>
      </footer>
    </div>
  );
};
