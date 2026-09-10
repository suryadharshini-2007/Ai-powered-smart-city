import React from 'react';
import {
  ShoppingBag,
  Bot,
  Scan,
  Users,
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  Leaf,
  Layers,
} from 'lucide-react';
import { ProductDetail } from './MarketTypes';

interface MarketHUDProps {
  selectedProduct: ProductDetail | null;
  onCloseProductModal: () => void;
  onCameraJump: (view: 'overview' | 'rice' | 'vegetables' | 'tomato' | 'wheat' | 'checkout' | 'robot') => void;
  onTriggerRobotAssist: () => void;
  onTriggerCheckout: () => void;
  isDemonstrating: boolean;
}

export const MarketHUD: React.FC<MarketHUDProps> = ({
  selectedProduct,
  onCloseProductModal,
  onCameraJump,
  onTriggerRobotAssist,
  onTriggerCheckout,
  isDemonstrating,
}) => {
  return (
    <>
      {/* Top Banner: Quick Footfall & Inventory Health Bar */}
      <div className="absolute top-18 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Footfall Indicators */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>
              Customers: <strong className="text-white font-bold">1,245</strong>
            </span>
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Products: <strong className="text-emerald-400 font-bold">428</strong>
            </span>
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>
              Robots: <strong className="text-purple-300 font-bold">8</strong>
            </span>
          </div>
        </div>

        {/* Digital Inventory Status Bar */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-xl flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-400 font-bold uppercase text-[9px]">INVENTORY:</span>
          {/* Rice */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Rice: Available
          </span>
          {/* Tomato */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Tomato: Available
          </span>
          {/* Wheat */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500 text-amber-300 font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Wheat: Low Stock
          </span>
          {/* Vegetables */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Vegetables: Available
          </span>
        </div>
      </div>

      {/* Bottom Floating Interactive Controller Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        {/* Left: Quick Camera Jumpers */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-300 mb-14">
          <span className="text-[10px] text-sky-400 font-bold px-2 uppercase tracking-wider flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
            MARKET AISLES:
          </span>
          <button
            type="button"
            onClick={() => onCameraJump('overview')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Full Market
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('rice')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Rice Aisle
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('vegetables')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Vegetables
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('tomato')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Tomato Island
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('wheat')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Wheat Silos
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('checkout')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            Checkout
          </button>
          <button
            type="button"
            onClick={() => onCameraJump('robot')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium"
          >
            AI Robot
          </button>
        </div>

        {/* Right: Quick Triggers */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Demonstrate Robot Assistance */}
          <button
            type="button"
            onClick={onTriggerRobotAssist}
            className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all shadow-xl flex items-center gap-2 ${
              isDemonstrating
                ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-400'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{isDemonstrating ? 'ROBOT ASSISTING...' : 'DEMONSTRATE ASSISTANCE'}</span>
          </button>

          {/* Start Smart Checkout */}
          <button
            type="button"
            onClick={onTriggerCheckout}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400 transition-all font-mono text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            <span>START CHECKOUT</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DETAILED PRODUCT INSPECTION MODAL (CLICKED PRODUCT) */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/80 rounded-2xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.4)] font-mono text-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={onCloseProductModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  FARM-GATE PRODUCT TELEMETRY
                </span>
                <h3 className="text-base font-bold text-white font-sans">
                  {selectedProduct.name}
                </h3>
              </div>
            </div>

            {/* Price & Stock Badge Row */}
            <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 p-3 rounded-xl mb-4">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Live Market Price</div>
                <div className="text-xl font-black text-cyan-300 font-heading">
                  {selectedProduct.displayPrice}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-400 uppercase">Inventory Stock</div>
                <div
                  className={`text-xs font-bold inline-flex items-center gap-1 ${
                    selectedProduct.stockStatus === 'Low Stock'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedProduct.stockStatus === 'Low Stock' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {selectedProduct.stock}
                </div>
              </div>
            </div>

            {/* Required Fields: Origin, Organic Status, Recommendation */}
            <div className="space-y-2.5 text-xs">
              {/* Origin */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-0.5 text-[10px] uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  Origin
                </div>
                <div className="text-slate-200">{selectedProduct.origin}</div>
              </div>

              {/* Organic Status */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5 text-[10px] uppercase">
                  <Leaf className="w-3.5 h-3.5" />
                  Organic Status
                </div>
                <div className="text-slate-200">{selectedProduct.organicStatus}</div>
              </div>

              {/* Recommendation */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-0.5 text-[10px] uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommendation
                </div>
                <div className="text-slate-200 leading-relaxed font-sans text-xs">
                  {selectedProduct.recommendation}
                </div>
              </div>

              {/* Traceability Hash */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between text-[10px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Blockchain Trace Hash:
                </span>
                <span className="text-cyan-400 font-mono">{selectedProduct.traceabilityHash}</span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={onCloseProductModal}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
