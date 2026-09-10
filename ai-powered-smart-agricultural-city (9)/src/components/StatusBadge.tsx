import React from 'react';

interface StatusBadgeProps {
  status: 'optimal' | 'warning' | 'critical' | 'calibrating' | 'normal' | 'alert' | 'online' | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const normalized = status.toLowerCase();

  const getTheme = () => {
    switch (normalized) {
      case 'optimal':
      case 'online':
      case 'normal':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-pulse',
        };
      case 'warning':
      case 'alert':
      case 'calibrating':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'critical':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400 animate-ping',
        };
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          dot: 'bg-sky-400',
        };
    }
  };

  const theme = getTheme();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider font-semibold whitespace-nowrap ${theme.bg} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
      {label || status}
    </span>
  );
};
