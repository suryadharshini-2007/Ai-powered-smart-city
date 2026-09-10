import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

interface HomeButtonProps {
  className?: string;
  label?: string;
}

export const HomeButton: React.FC<HomeButtonProps> = ({
  className = '',
  label = 'Master City',
}) => {
  const navigate = useNavigate();

  return (
    <button
      id="btn-home-navigation"
      type="button"
      onClick={() => navigate('/city')}
      className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 hover:border-emerald-500/50 transition-all text-sm font-medium shadow-md shadow-black/20 ${className}`}
      title="Return to Master 3D Smart City"
    >
      <Home className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
    </button>
  );
};
