import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ShoppingBag,
  Bot,
  Users,
  CreditCard,
  PackageCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Tag,
  Store,
} from 'lucide-react';

interface MarketSectionProps {
  productsAvailable: number;
  robotsActive: number;
  customersToday: number;
  digitalPaymentsPercent: number;
  inventoryStatus: string;
  marketEnergyUsageKw: number;
  productCategories: { name: string; count: number; color: string }[];
}

export const MarketSection: React.FC<MarketSectionProps> = ({
  productsAvailable,
  robotsActive,
  customersToday,
  digitalPaymentsPercent,
  inventoryStatus,
  marketEnergyUsageKw,
  productCategories,
}) => {
  return (
    <div className="bg-slate-950/85 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(244,63,94,0.15)] font-mono text-slate-100">
      {/* Header with Navigation Link to 3D Scene */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-rose-400 uppercase font-extrabold tracking-widest">
              SECTOR 03 &bull; DIGITAL COMMERCE
            </div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight">
              Smart Market, Robotic Shopkeepers & Holographic Inventory
            </h2>
          </div>
        </div>

        <Link
          to="/zone/market"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs transition-all font-semibold"
        >
          <span>Launch 3D Market Zone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {/* Products Available */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            Products Available:
          </div>
          <div className="text-xl font-black text-white">{productsAvailable}</div>
          <div className="text-[10px] text-slate-400 mt-1">Direct Farm-to-Shelf</div>
        </div>

        {/* Robots Active */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            Robots Active:
          </div>
          <div className="text-xl font-black text-sky-300">{robotsActive} Units</div>
          <div className="text-[10px] text-sky-400 mt-1">Autonomous Assistants</div>
        </div>

        {/* Customers Today */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Customers Today:
          </div>
          <div className="text-xl font-black text-amber-300">
            {customersToday.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+14.8% footfall</span>
          </div>
        </div>

        {/* Digital Payments */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            Digital Payments:
          </div>
          <div className="text-xl font-black text-emerald-400">
            {digitalPaymentsPercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Cashless Instant UPI</div>
        </div>

        {/* Inventory Status */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <PackageCheck className="w-3.5 h-3.5 text-teal-400" />
            Inventory Status:
          </div>
          <div className="text-base font-black text-teal-300 mt-0.5">{inventoryStatus}</div>
          <div className="text-[10px] text-emerald-400 mt-1">0 Shelf Expired Waste</div>
        </div>

        {/* Market Energy Usage */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Market Energy:
          </div>
          <div className="text-xl font-black text-purple-300">
            {marketEnergyUsageKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">100% Rooftop Solar</div>
        </div>
      </div>

      {/* Visual Analytics & Holographic Price Index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Category Stock Distribution Bar Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              AGRICULTURAL PRODUCT SECTORS IN STOCK
            </span>
            <span className="text-[10px] text-slate-400">SKU Count</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productCategories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #f43f5e',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" name="Available SKUs" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holographic Dynamic Pricing Board (Live Market Ticker) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                HOLOGRAPHIC DYNAMIC COMMERCE PRICING
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">AI PRICE BALANCED</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Organic Basmati</div>
                <div className="text-base font-black text-amber-400 mt-0.5">₹65/kg</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Direct Milling</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Hydro Tomato</div>
                <div className="text-base font-black text-rose-400 mt-0.5">₹40/kg</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Pesticide Free</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Golden Wheat</div>
                <div className="text-base font-black text-amber-300 mt-0.5">₹55/kg</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">High Gluten</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Crisp Greens</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">₹35/kg</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Vertical Farm</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-3">
            <span>Automated RFID Smart Carts Active:</span>
            <span className="font-bold text-sky-300">14 Units (Instant Checkout)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
