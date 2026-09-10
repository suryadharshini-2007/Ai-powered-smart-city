import React from 'react';

interface ObjectTooltipProps {
  title: string;
  category?: string;
  metrics?: { label: string; value: string }[];
  visible: boolean;
  x?: number;
  y?: number;
}

export const ObjectTooltip: React.FC<ObjectTooltipProps> = ({
  title,
  category,
  metrics = [],
  visible,
  x = 0,
  y = 0,
}) => {
  if (!visible) return null;

  return (
    <div
      id="3d-object-tooltip"
      style={{
        left: `${x + 16}px`,
        top: `${y + 16}px`,
      }}
      className="fixed z-40 pointer-events-none p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 shadow-2xl text-white min-w-[180px] animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <h4 className="text-xs font-heading font-bold text-emerald-300">{title}</h4>
        {category && (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {category}
          </span>
        )}
      </div>

      {metrics.length > 0 && (
        <div className="space-y-1 mt-2 pt-1.5 border-t border-slate-800/80">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">{m.label}:</span>
              <span className="text-white font-semibold">{m.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 text-[10px] font-mono text-emerald-400/80 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        Click node to inspect zone
      </div>
    </div>
  );
};
