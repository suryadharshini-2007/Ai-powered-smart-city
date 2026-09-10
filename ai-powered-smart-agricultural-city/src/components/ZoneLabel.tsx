import React from 'react';
import { Html } from '@react-three/drei';
import { LucideIcon } from 'lucide-react';

interface ZoneLabelProps {
  position: [number, number, number];
  title: string;
  tagline?: string;
  color?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const ZoneLabel: React.FC<ZoneLabelProps> = ({
  position,
  title,
  tagline,
  color = '#22c55e',
  icon: Icon,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  return (
    <Html
      position={position}
      center
      distanceFactor={22}
      zIndexRange={[100, 0]}
    >
      <div
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        className="group cursor-pointer select-none px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 hover:border-emerald-400 text-white shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" />}
        <div className="flex flex-col text-left">
          <span className="text-xs font-heading font-bold text-slate-100 group-hover:text-emerald-300">
            {title}
          </span>
          {tagline && (
            <span className="text-[9px] font-mono text-slate-400">
              {tagline}
            </span>
          )}
        </div>
      </div>
    </Html>
  );
};
