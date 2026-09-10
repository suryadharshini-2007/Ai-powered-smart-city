import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface SmartRestroomProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SmartRestroom: React.FC<SmartRestroomProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const [tapSimulated, setTapSimulated] = useState(false);
  const [flushSimulated, setFlushSimulated] = useState(false);
  const [cleanSimulated, setCleanSimulated] = useState(false);

  const waterStreamRef = useRef<THREE.Mesh>(null);
  const uvCleanRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterStreamRef.current && tapSimulated) {
      waterStreamRef.current.scale.set(1, 1 + Math.sin(t * 15) * 0.1, 1);
    }
    if (uvCleanRef.current && cleanSimulated) {
      uvCleanRef.current.rotation.y = t * 2;
    }
  });

  const handleTriggerTap = (e: any) => {
    e.stopPropagation();
    setTapSimulated(true);
    setTimeout(() => setTapSimulated(false), 3000);
  };

  const handleTriggerFlush = (e: any) => {
    e.stopPropagation();
    setFlushSimulated(true);
    setTimeout(() => setFlushSimulated(false), 2500);
  };

  const handleTriggerClean = (e: any) => {
    e.stopPropagation();
    setCleanSimulated(true);
    setTimeout(() => setCleanSimulated(false), 3500);
  };

  const handleSelectRestroom = () => {
    onSelectNode({
      id: 'smart-restroom-facility-01',
      name: 'Zero-Waste Bio-Smart Eco-Restroom',
      category: 'Smart Sanitation & Circular Water',
      status: 'optimal',
      efficiency: 99.1,
      powerKw: 1.1,
      description:
        'Touchless, hygienic smart restroom powered by infrared sensor faucets, vacuum micro-flush cisterns, automatic UV-C surface sanitization, continuous acoustic pipe leak detection, and greywater recycling for botanical irrigation.',
      telemetryFields: [
        { label: 'Sensor Taps', value: tapSimulated ? 'Active Flowing (1.8 L/min)' : 'Standby Touchless' },
        { label: 'Automatic Flush', value: flushSimulated ? 'Dual-Action Vacuum Flush' : 'Armed' },
        { label: 'Water Saving', value: '64.8% vs Baseline Fixtures' },
        { label: 'Leak Detection', value: '0.00 L/hr (Acoustic Sensors Clear)' },
        { label: 'Auto Cleaning', value: cleanSimulated ? 'UV-C Sterilization Running' : 'Cycle Ready (Next: 14:00)' },
        { label: 'Waste Segregation', value: 'Dual Solid/Greywater Separation' },
        { label: 'Reuse System', value: '1,450 L/day Recycled for Irrigation' },
      ],
    });
  };

  return (
    <group
      position={[-21, 0, -4]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelectRestroom();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Eco-Restroom Building Envelope */}
      {/* Concrete Foundation Slab */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.2, 5.2]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Modern Charcoal & Wood-tone Facade */}
      <mesh position={[0, 1.7, -2.4]} castShadow>
        <boxGeometry args={[6.6, 3.2, 0.3]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} />
      </mesh>
      <mesh position={[-3.2, 1.7, 0]} castShadow>
        <boxGeometry args={[0.3, 3.2, 4.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[3.2, 1.7, 0]} castShadow>
        <boxGeometry args={[0.3, 3.2, 4.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Translucent Glass Front Entry with Modern Cutout */}
      <mesh position={[0, 1.7, 2.4]} receiveShadow>
        <boxGeometry args={[4.2, 3.2, 0.15]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} metalness={0.9} />
      </mesh>

      {/* Roof Canopy Overhang */}
      <mesh position={[0, 3.35, 0]} castShadow>
        <boxGeometry args={[7.2, 0.25, 5.6]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} />
      </mesh>

      {/* Restroom Gender-Neutral / Eco Sign */}
      <mesh position={[0, 3.0, 2.48]}>
        <planeGeometry args={[2.0, 0.4]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={isNight ? 2 : 1}
        />
      </mesh>

      {/* 2. Interior Visible Fixtures (Touchless Vanities & Sensor Taps) */}
      <group position={[0, 0.8, -1.2]}>
        {/* Vanity Countertop */}
        <mesh castShadow>
          <boxGeometry args={[4.4, 0.15, 0.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
        </mesh>

        {/* 3 Touchless Sinks with Sensor Faucets */}
        {[-1.3, 0, 1.3].map((sx, sIdx) => (
          <group key={`sink-${sIdx}`} position={[sx, 0.1, 0]}>
            {/* Sink Basin */}
            <mesh>
              <boxGeometry args={[0.8, 0.18, 0.6]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.1} />
            </mesh>
            {/* Curved Goose-neck Sensor Tap */}
            <mesh position={[0, 0.25, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Tap Sensor Eye */}
            <mesh position={[0, 0.18, -0.16]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>

            {/* Simulated Flowing Water Stream */}
            {tapSimulated && (
              <mesh ref={sIdx === 1 ? waterStreamRef : null} position={[0, 0.1, -0.1]}>
                <cylinderGeometry args={[0.015, 0.025, 0.22, 8]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* UV-C Auto Cleaning Light Array (active during sanitization) */}
      {cleanSimulated && (
        <group ref={uvCleanRef} position={[0, 2.8, 0]}>
          <mesh>
            <cylinderGeometry args={[2.5, 2.5, 0.05, 16]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* Flush Indicator LED */}
      {flushSimulated && (
        <mesh position={[0, 2.2, -2.1]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3} />
        </mesh>
      )}

      {/* 3. Floating Interactive Restroom HUD */}
      <Html position={[0, 3.9, 0]} center distanceFactor={10} className="pointer-events-auto select-none">
        <div className="bg-slate-950/95 border border-sky-400/80 p-3 rounded-2xl shadow-2xl text-left w-[290px] backdrop-blur-md font-mono text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SMART RESTROOM FACILITY
            </span>
            <span className="text-[8px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300 font-bold border border-emerald-800">
              OPTIMAL
            </span>
          </div>

          {/* 8 Required Features Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[8.5px] mb-2.5">
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">SENSOR TAPS</span>
              <span className="text-sky-300 font-bold">
                {tapSimulated ? 'Water Flowing' : 'Touchless Ready'}
              </span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">AUTOMATIC FLUSH</span>
              <span className="text-emerald-400 font-bold">
                {flushSimulated ? 'Vacuum Flush Active' : 'Dual Sensor'}
              </span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">WATER SAVING</span>
              <span className="text-emerald-400 font-bold">64.8% Reduction</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">LEAK DETECTION</span>
              <span className="text-sky-300 font-bold">0.00 L/hr (0 Leaks)</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">AUTO CLEANING</span>
              <span className="text-purple-300 font-bold">
                {cleanSimulated ? 'UV Sterilizing...' : 'UV-C Cycle Armed'}
              </span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">WASTE COLLECTION</span>
              <span className="text-white font-bold">Zero-Odor Sealed</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">SEGREGATION</span>
              <span className="text-amber-300 font-bold">Grey/Black Split</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[7.5px]">REUSE SYSTEM</span>
              <span className="text-emerald-300 font-bold">Campus Gardens</span>
            </div>
          </div>

          {/* Interactive Simulation Buttons */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800">
            <button
              onClick={handleTriggerTap}
              className="py-1 px-1 rounded bg-sky-700 hover:bg-sky-600 active:scale-95 text-[8px] font-bold uppercase transition text-center"
            >
              TEST TAP
            </button>
            <button
              onClick={handleTriggerFlush}
              className="py-1 px-1 rounded bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-[8px] font-bold uppercase transition text-center"
            >
              TRIGGER FLUSH
            </button>
            <button
              onClick={handleTriggerClean}
              className="py-1 px-1 rounded bg-purple-700 hover:bg-purple-600 active:scale-95 text-[8px] font-bold uppercase transition text-center"
            >
              UV CLEAN
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
};
