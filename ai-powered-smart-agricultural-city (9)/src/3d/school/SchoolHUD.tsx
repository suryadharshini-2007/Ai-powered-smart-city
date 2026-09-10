import React from 'react';
import {
  GraduationCap,
  Bot,
  Sun,
  Droplets,
  Trophy,
  Car,
  Tv,
  Sparkles,
  ShieldCheck,
  RotateCw,
  Wrench,
} from 'lucide-react';
import { ClassroomScreenMode, SportType } from './SchoolTypes';

interface SchoolHUDProps {
  screenMode: ClassroomScreenMode;
  onCycleScreenMode: () => void;
  selectedSport: SportType;
  onSelectSport: (sport: SportType) => void;
  onDemonstrateAssistance: () => void;
  isDemonstrating: boolean;
  onCameraJump: (view: 'overview' | 'classroom' | 'sports' | 'solar' | 'parking' | 'restroom') => void;
}

export const SchoolHUD: React.FC<SchoolHUDProps> = ({
  screenMode,
  onCycleScreenMode,
  selectedSport,
  onSelectSport,
  onDemonstrateAssistance,
  isDemonstrating,
  onCameraJump,
}) => {
  return (
    <>
      {/* Bottom Floating Interactive Controller Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        {/* Left: Quick Campus Zone Jumper */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-300 mb-14">
          <span className="text-[10px] text-sky-400 font-bold px-2 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            CAMPUS NAV:
          </span>
          <button
            type="button"
            onClick={() => onCameraJump('overview')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Full Campus
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('classroom')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Classroom
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('sports')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Sports & Track
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('solar')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Solar & Eco
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('parking')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            EV Bus & Parking
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('restroom')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Smart Restroom
          </button>
        </div>

        {/* Right: Quick Action Triggers */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Demonstrate Assistance Button */}
          <button
            type="button"
            onClick={onDemonstrateAssistance}
            className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all shadow-xl flex items-center gap-2 ${
              isDemonstrating
                ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-400'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{isDemonstrating ? 'ASSISTING STUDENT...' : 'DEMONSTRATE ASSISTANCE'}</span>
          </button>

          {/* Cycle Smart Classroom Screen Mode */}
          <button
            type="button"
            onClick={onCycleScreenMode}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-sky-500/50 transition-all font-mono text-xs font-bold shadow-xl flex items-center gap-2"
            title="Cycle Smart Classroom Screen Display"
          >
            <Tv className="w-4 h-4 text-sky-400" />
            <span>SCREEN: {screenMode.replace('_', ' ')}</span>
          </button>
        </div>
      </div>
    </>
  );
};
