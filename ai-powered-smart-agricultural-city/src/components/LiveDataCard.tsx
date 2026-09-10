import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface LiveDataCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconColor?: string;
  changePercent?: number;
  subtitle?: string;
  badgeText?: string;
}

export const LiveDataCard: React.FC<LiveDataCardProps> = ({
  id,
  title,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-emerald-400',
  changePercent,
  subtitle,
  badgeText,
}) => {
  return (
    <GlassPanel id={id} className="p-4 relative overflow-hidden group hover:border-sky-500/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 font-sans tracking-wide">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl font-heading font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {(changePercent !== undefined || subtitle || badgeText) && (
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px]">
          {subtitle && (
            <span className="text-slate-400 font-mono truncate">{subtitle}</span>
          )}
          {changePercent !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-mono font-medium ${
                changePercent > 0
                  ? 'text-emerald-400'
                  : changePercent < 0
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {changePercent > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : changePercent < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {Math.abs(changePercent)}%
            </span>
          )}
          {badgeText && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-[10px] border border-sky-500/20">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </GlassPanel>
  );
};
