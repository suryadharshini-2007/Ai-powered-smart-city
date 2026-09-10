import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing 3D Biosphere Matrix...',
  subtext = 'Synchronizing IoT telemetry streams & spatial shaders',
}) => {
  return (
    <div
      id="screen-loading-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border-2 border-sky-500/20 border-b-sky-400 animate-spin [animation-duration:1.5s]" />
        <div className="absolute">
          <Sprout className="w-6 h-6 text-emerald-400 animate-pulse" />
        </div>
      </div>

      <h2 className="text-lg font-heading font-bold text-white tracking-wide">{message}</h2>
      <p className="text-xs font-mono text-slate-400 mt-2 max-w-sm text-center">{subtext}</p>

      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-6">
        <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-sky-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};
