import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { Eye, Compass, Box, ZoomIn } from 'lucide-react';

interface CameraControlsProps {
  currentPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  onSelectPreset?: (preset: 'overview' | 'topDown' | 'isometric' | 'closeUp') => void;
  autoRotate?: boolean;
}

export const SceneOrbitControls: React.FC<{ autoRotate?: boolean }> = ({ autoRotate = false }) => {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05} // Keep above ground plane
      minDistance={6}
      maxDistance={65}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
    />
  );
};

export const CameraPresetBar: React.FC<{
  currentPreset: string;
  onSelectPreset: (preset: 'overview' | 'topDown' | 'isometric' | 'closeUp') => void;
}> = ({ currentPreset, onSelectPreset }) => {
  const presets: { id: 'overview' | 'topDown' | 'isometric' | 'closeUp'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Perspective', icon: Eye },
    { id: 'topDown', label: 'Grid Map', icon: Compass },
    { id: 'isometric', label: 'Isometric', icon: Box },
    { id: 'closeUp', label: 'Macro', icon: ZoomIn },
  ];

  return (
    <div
      id="camera-preset-selector-bar"
      className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-xl"
    >
      {presets.map(p => {
        const Icon = p.icon;
        const active = currentPreset === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPreset(p.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              active
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
