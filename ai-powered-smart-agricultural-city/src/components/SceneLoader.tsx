import React from 'react';
import { Html } from '@react-three/drei';
import { Sprout } from 'lucide-react';

interface SceneLoaderProps {
  label?: string;
}

export const SceneLoader: React.FC<SceneLoaderProps> = ({
  label = 'Streaming 3D Spatial Geometry...',
}) => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-white min-w-[200px] shadow-2xl">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mb-2" />
        <span className="text-xs font-heading font-medium text-emerald-300">{label}</span>
      </div>
    </Html>
  );
};
