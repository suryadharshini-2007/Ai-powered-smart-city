import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'subtle' | 'accent';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  id,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-slate-950/75 backdrop-blur-md border border-sky-500/20 shadow-xl shadow-black/40',
    subtle: 'bg-slate-900/50 backdrop-blur-sm border border-white/10 shadow-lg',
    accent: 'bg-slate-950/80 backdrop-blur-lg border border-emerald-500/30 shadow-2xl shadow-emerald-950/20',
  };

  return (
    <div
      id={id}
      className={`rounded-2xl transition-all duration-200 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
