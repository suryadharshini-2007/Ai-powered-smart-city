import React from 'react';
import { X, ExternalLink, Activity, Zap, Droplets, Cpu } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';

export interface SelectedNodeDetails {
  id: string;
  name: string;
  crop?: string;
  category: string;
  zoneRoute?: string;
  status: string;
  efficiency: number;
  powerKw?: number;
  waterUsageLpm?: number;
  description: string;
  telemetryFields?: { label: string; value: string | number; unit?: string }[];
}

interface ObjectInfoPanelProps {
  data: SelectedNodeDetails | null;
  onClose: () => void;
}

export const ObjectInfoPanel: React.FC<ObjectInfoPanelProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <GlassPanel
      id="object-info-floating-panel"
      className="fixed bottom-6 right-6 z-40 w-80 sm:w-96 p-5 border-sky-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {data.category}
            </span>
            <StatusBadge status={data.status} size="sm" />
          </div>
          <h3 className="text-base font-heading font-bold text-white leading-tight">
            {data.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
        {data.description}
      </p>

      {/* Primary Key Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Efficiency</span>
          </div>
          <div className="text-lg font-heading font-bold text-emerald-400">
            {data.efficiency}%
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Power Draw</span>
          </div>
          <div className="text-lg font-heading font-bold text-amber-400">
            {data.powerKw ?? 340} <span className="text-xs font-normal">kW</span>
          </div>
        </div>
      </div>

      {/* Additional Telemetry Parameters */}
      {data.telemetryFields && data.telemetryFields.length > 0 && (
        <div className="space-y-1.5 mb-4 py-2 border-y border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Real-Time Node Telemetry
          </div>
          {data.telemetryFields.map((field, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{field.label}</span>
              <span className="text-white font-medium">
                {field.value} {field.unit}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action CTA */}
      {data.zoneRoute && (
        <Link
          to={data.zoneRoute}
          id="btn-inspect-full-scene"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-emerald-950/40"
        >
          <span>Enter Full 3D Zone Scene</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )}
    </GlassPanel>
  );
};
