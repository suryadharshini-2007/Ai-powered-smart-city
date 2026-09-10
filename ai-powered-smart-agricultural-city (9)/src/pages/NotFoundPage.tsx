import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <GlassPanel className="p-8 max-w-md text-center border-slate-800">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-heading font-bold text-white mb-2">
          Coordinates Not Found in Grid
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-6">
          The requested spatial sector or route does not exist in the active Smart Agricultural City atlas.
        </p>
        <Link
          to="/city"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Master 3D City</span>
        </Link>
      </GlassPanel>
    </div>
  );
};
