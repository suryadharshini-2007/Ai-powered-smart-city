import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Leaf,
  FileText,
  Boxes,
  HelpCircle,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SmartBinData } from './WasteTypes';
import { wasteSounds } from './WasteSounds';

interface SmartWasteBinsProps {
  bins: SmartBinData[];
  selectedBinId: string | null;
  onSelectBin: (bin: SmartBinData) => void;
  onToggleCritical: (binId: string) => void;
  onEmptyBin: (binId: string) => void;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SmartWasteBins: React.FC<SmartWasteBinsProps> = ({
  bins,
  selectedBinId,
  onSelectBin,
  onToggleCritical,
  onEmptyBin,
  onSelectNode,
  isNight = false,
}) => {
  const beaconRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beaconRef.current) {
      beaconRef.current.rotation.y = t * 3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {bins.map((bin) => {
        const isSelected = selectedBinId === bin.id;
        const isCritical = bin.fillLevel >= 85 || bin.isCritical;

        // Color coding for the fill status
        const statusColor = isCritical
          ? '#ef4444' // red
          : bin.fillLevel >= 60
          ? '#f59e0b' // amber
          : '#10b981'; // green

        return (
          <group
            key={bin.id}
            position={bin.position}
            onClick={(e) => {
              e.stopPropagation();
              wasteSounds.playBinScanBeep();
              onSelectBin(bin);
              onSelectNode({
                id: bin.id,
                name: bin.name,
                category: 'IoT Ultrasonic Multi-Stream Smart Bin',
                status: isCritical ? 'warning' : 'optimal',
                efficiency: 99.2,
                powerKw: 0.05,
                description:
                  'Solar-powered smart bin cluster equipped with optical fill sensors, internal compaction screw, and automatic pneumatic sorting chambers.',
                telemetryFields: [
                  { label: 'Total Fill Level', value: `${bin.fillLevel}%` },
                  { label: 'Organic Stream', value: `${bin.composition.organic}%` },
                  { label: 'Plastic Stream', value: `${bin.composition.plastic}%` },
                  { label: 'Paper Stream', value: `${bin.composition.paper}%` },
                  { label: 'Other Stream', value: `${bin.composition.other}%` },
                  { label: 'Dispatch State', value: bin.status.toUpperCase() },
                ],
              });
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Concrete Pedestal / Ground Pad */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[2.4, 0.1, 1.2]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>

            {/* Main Bin Housing Body */}
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.6, 0.9]} />
              <meshStandardMaterial
                color={isNight ? '#0f172a' : '#1e293b'}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* 4 Multi-Stream Colored Ingestion Apertures */}
            {/* 1. Organic (Green) */}
            <group position={[-0.75, 1.25, 0.46]}>
              <mesh>
                <boxGeometry args={[0.38, 0.38, 0.04]} />
                <meshStandardMaterial color="#10b981" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[0.26, 0.14, 0.05]} />
                <meshStandardMaterial color="#064e3b" />
              </mesh>
            </group>

            {/* 2. Plastic (Amber/Yellow) */}
            <group position={[-0.25, 1.25, 0.46]}>
              <mesh>
                <boxGeometry args={[0.38, 0.38, 0.04]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            </group>

            {/* 3. Paper (Blue) */}
            <group position={[0.25, 1.25, 0.46]}>
              <mesh>
                <boxGeometry args={[0.38, 0.38, 0.04]} />
                <meshStandardMaterial color="#0284c7" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[0.28, 0.06, 0.05]} />
                <meshStandardMaterial color="#082f49" />
              </mesh>
            </group>

            {/* 4. Other (Slate/Purple) */}
            <group position={[0.75, 1.25, 0.46]}>
              <mesh>
                <boxGeometry args={[0.38, 0.38, 0.04]} />
                <meshStandardMaterial color="#8b5cf6" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[0.26, 0.14, 0.05]} />
                <meshStandardMaterial color="#2e1065" />
              </mesh>
            </group>

            {/* Solar Panel Roof */}
            <mesh position={[0, 1.76, 0]} rotation={[-0.05, 0, 0]}>
              <boxGeometry args={[2.3, 0.06, 1.0]} />
              <meshStandardMaterial
                color="#0369a1"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Vertical 3D Fill Level LED Gauge */}
            <group position={[1.16, 0.9, 0]}>
              {/* Backing plate */}
              <mesh>
                <boxGeometry args={[0.06, 1.3, 0.2]} />
                <meshStandardMaterial color="#020617" />
              </mesh>
              {/* Glowing Fill Bar scaled by fillLevel */}
              <mesh position={[0.02, -0.65 + (bin.fillLevel / 100) * 0.65, 0]}>
                <boxGeometry args={[0.04, Math.max(0.05, (bin.fillLevel / 100) * 1.3), 0.14]} />
                <meshStandardMaterial
                  color={statusColor}
                  emissive={statusColor}
                  emissiveIntensity={isCritical ? 3.0 : 1.5}
                />
              </mesh>
            </group>

            {/* Flashing Alert Beacon if Critical */}
            {isCritical && (
              <group position={[0, 1.95, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.1, 0.14, 0.22, 12]} />
                  <meshStandardMaterial
                    color="#ef4444"
                    emissive="#ef4444"
                    emissiveIntensity={2.5}
                  />
                </mesh>
                <pointLight color="#ef4444" intensity={2} distance={5} />
              </group>
            )}

            {/* 3D Floating Fill Tag always visible */}
            <Html
              position={[0, 2.3, 0]}
              center
              distanceFactor={9}
              className="pointer-events-none select-none"
            >
              <div
                className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold border shadow-xl flex items-center gap-1.5 backdrop-blur-md ${
                  isCritical
                    ? 'bg-red-950/90 text-red-300 border-red-500 animate-pulse'
                    : 'bg-slate-950/90 text-slate-200 border-slate-700'
                }`}
              >
                <Trash2
                  className={`w-3.5 h-3.5 ${
                    isCritical ? 'text-red-400' : 'text-emerald-400'
                  }`}
                />
                <span>FILL: {bin.fillLevel}%</span>
                {isCritical && (
                  <span className="bg-red-600 text-white text-[8px] px-1 py-0.2 rounded font-black">
                    CRITICAL
                  </span>
                )}
              </div>
            </Html>

            {/* ========================================================= */}
            {/* EXPANDED INTERACTIVE POPUP (WHEN BIN IS CLICKED / SELECTED) */}
            {/* ========================================================= */}
            {isSelected && (
              <Html
                position={[0, 3.4, 0]}
                center
                distanceFactor={7.5}
                className="select-none pointer-events-auto"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-72 bg-slate-950/95 backdrop-blur-xl border border-teal-500/80 rounded-2xl p-4 shadow-[0_0_35px_rgba(20,184,166,0.4)] text-slate-100 font-mono"
                >
                  {/* Title Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded bg-teal-500/20 text-teal-400">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-teal-300">
                        {bin.name.split('(')[0]}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isCritical
                          ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                      }`}
                    >
                      {isCritical ? 'ALERT' : 'OPTIMAL'}
                    </span>
                  </div>

                  {/* Visual Fill-Level Indicator Bar & Percentage */}
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Fill Level:
                      </span>
                      <span
                        className={`text-sm font-black ${
                          isCritical
                            ? 'text-red-400'
                            : bin.fillLevel >= 60
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {bin.fillLevel}%
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 animate-pulse'
                            : bin.fillLevel >= 60
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Multi-Stream Waste Composition Breakdown */}
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Waste Composition Breakdown:
                  </div>

                  <div className="space-y-1.5 mb-3 text-[11px]">
                    {/* Organic: 42% */}
                    <div className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded-lg border border-emerald-900/40">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Organic:</span>
                      </div>
                      <span className="font-extrabold text-white">
                        {bin.composition.organic}%
                      </span>
                    </div>

                    {/* Plastic: 27% */}
                    <div className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded-lg border border-amber-900/40">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Boxes className="w-3.5 h-3.5" />
                        <span>Plastic:</span>
                      </div>
                      <span className="font-extrabold text-white">
                        {bin.composition.plastic}%
                      </span>
                    </div>

                    {/* Paper: 18% */}
                    <div className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded-lg border border-sky-900/40">
                      <div className="flex items-center gap-1.5 text-sky-400">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Paper:</span>
                      </div>
                      <span className="font-extrabold text-white">
                        {bin.composition.paper}%
                      </span>
                    </div>

                    {/* Other: 13% */}
                    <div className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded-lg border border-purple-900/40">
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Other:</span>
                      </div>
                      <span className="font-extrabold text-white">
                        {bin.composition.other}%
                      </span>
                    </div>
                  </div>

                  {/* Simulation Controls for testing Robot Collection */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => onToggleCritical(bin.id)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                        isCritical
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {isCritical ? 'NORMAL FILL' : 'SET CRITICAL'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onEmptyBin(bin.id)}
                      className="py-1.5 px-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold shadow-lg transition-all flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      EMPTY BIN
                    </button>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
