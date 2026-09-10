import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Footprints, Activity, ArrowRight } from 'lucide-react';
import { AnimatedPedestrian } from './AnimatedPedestrian';

interface Pulse {
  id: number;
  x: number;
  z: number;
  scale: number;
  opacity: number;
}

export const EnergyPathway: React.FC = () => {
  const [footsteps, setFootsteps] = useState(128);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const pulseIdRef = useRef(0);

  // Position of the Energy Pathway in the city (connecting Central Plaza to Market & School)
  // Length 14 units, width 2.2 units
  const pathStart: [number, number, number] = [4.5, 0.03, 3.5];
  const pathEnd: [number, number, number] = [17.5, 0.03, 3.5];
  const length = 13;
  const width = 2.4;
  const tileCols = 10;
  const tileRows = 2;

  // Kinetic energy metrics
  const mechanicalEnergy = (footsteps * 0.332).toFixed(1);
  const electricalEnergy = (footsteps * 0.0922).toFixed(1);

  // Cycle the simulated energy workflow pipeline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % 5);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleFootstep = (pos: [number, number, number]) => {
    setFootsteps((prev) => prev + 1);

    // Add a glowing energy pulse on the tile
    const newPulse: Pulse = {
      id: pulseIdRef.current++,
      x: pos[0],
      z: pos[2],
      scale: 0.2,
      opacity: 0.9,
    };
    setPulses((prev) => [...prev.slice(-8), newPulse]);
  };

  // Animate pulse expansions and decay
  useFrame((_, delta) => {
    if (pulses.length > 0) {
      setPulses((prev) =>
        prev
          .map((p) => ({
            ...p,
            scale: p.scale + delta * 2.5,
            opacity: p.opacity - delta * 1.5,
          }))
          .filter((p) => p.opacity > 0.05)
      );
    }
  });

  const pipelineStages = [
    'FOOTSTEP',
    'MECHANICAL ENERGY',
    'GENERATOR',
    'ELECTRICAL ENERGY',
    'SMART GRID',
  ];

  return (
    <group position={[11, 0.025, 3.5]}>
      {/* 1. Base Pathway Foundation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#0b131e" roughness={0.6} />
      </mesh>

      {/* 2. Glowing Lateral Energy Conduits */}
      <mesh position={[0, 0.01, -width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.12]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[0, 0.01, width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.12]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* 3. Kinetic Piezoelectric Energy Tiles (Grid of smart stepping pads) */}
      {Array.from({ length: tileCols }).map((_, c) => {
        const xOffset = -length / 2 + (c + 0.5) * (length / tileCols);
        return Array.from({ length: tileRows }).map((_, r) => {
          const zOffset = -width / 4 + r * (width / 2);
          const isEven = (c + r) % 2 === 0;
          return (
            <group key={`tile-${c}-${r}`} position={[xOffset, 0.015, zOffset]}>
              {/* Tile Body */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[length / tileCols - 0.14, width / tileRows - 0.14]} />
                <meshStandardMaterial
                  color={isEven ? '#1e293b' : '#0f172a'}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              {/* Piezoelectric Kinetic Center Ring */}
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.18, 0.28, 16]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.65} />
              </mesh>
            </group>
          );
        });
      })}

      {/* 4. Active Stepping Energy Pulses */}
      {pulses.map((pulse) => (
        <group key={pulse.id} position={[pulse.x - 11, 0.025, pulse.z - 3.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[pulse.scale * 0.4, pulse.scale * 0.7, 24]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={pulse.opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight
            position={[0, 0.1, 0]}
            color="#38bdf8"
            intensity={pulse.opacity * 2}
            distance={2}
          />
        </group>
      ))}

      {/* 5. Walking Pedestrians on the Energy Pathway */}
      {/* Pedestrian 1 walking West to East */}
      <AnimatedPedestrian
        startPos={[-pathStart[0] + 5, 0, 0.4]}
        endPos={[pathEnd[0] - 8, 0, 0.4]}
        speed={1.1}
        initialProgress={0.1}
        color="#38bdf8"
        onFootstep={handleFootstep}
      />
      {/* Pedestrian 2 walking East to West */}
      <AnimatedPedestrian
        startPos={[pathEnd[0] - 8, 0, -0.4]}
        endPos={[-pathStart[0] + 5, 0, -0.4]}
        speed={0.9}
        initialProgress={0.65}
        color="#34d399"
        onFootstep={handleFootstep}
      />
      {/* Pedestrian 3 walking West to East */}
      <AnimatedPedestrian
        startPos={[-pathStart[0] + 4, 0, 0]}
        endPos={[pathEnd[0] - 7, 0, 0]}
        speed={1.3}
        initialProgress={0.4}
        color="#fbbf24"
        onFootstep={handleFootstep}
      />

      {/* 6. Floating 3D HUD Information Panel */}
      <Html
        position={[0, 2.6, -1.6]}
        center
        distanceFactor={22}
        zIndexRange={[90, 0]}
      >
        <div
          id="pedestrian-energy-pathway-panel"
          className="w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)] text-white select-none pointer-events-none animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-heading font-extrabold tracking-wide text-emerald-300">
                PEDESTRIAN ENERGY PATHWAY
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
              KINETIC HARVEST
            </span>
          </div>

          {/* Three Required Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
            <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] font-mono text-slate-400 leading-tight">
                FOOTSTEPS DETECTED
              </div>
              <div className="text-sm font-heading font-bold text-white mt-0.5">
                {footsteps}
              </div>
            </div>

            <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] font-mono text-slate-400 leading-tight">
                MECHANICAL ENERGY
              </div>
              <div className="text-sm font-heading font-bold text-sky-400 mt-0.5">
                {mechanicalEnergy} <span className="text-[10px] font-mono">kJ</span>
              </div>
            </div>

            <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] font-mono text-slate-400 leading-tight">
                ELECTRICAL ENERGY
              </div>
              <div className="text-sm font-heading font-bold text-emerald-400 mt-0.5">
                {electricalEnergy} <span className="text-[10px] font-mono">kJ</span>
              </div>
            </div>
          </div>

          {/* Animated Energy Conversion Sequence Workflow */}
          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/20">
            <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Simulated Kinetic Conversion Flow:</span>
            </div>

            <div className="flex items-center justify-between gap-1 text-[8px] sm:text-[9px] font-mono">
              {pipelineStages.map((stage, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <React.Fragment key={stage}>
                    <div
                      className={`px-1.5 py-1 rounded-md text-center transition-all duration-300 font-semibold ${
                        isActive
                          ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30 scale-105'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {stage.replace(' ENERGY', '')}
                    </div>
                    {idx < pipelineStages.length - 1 && (
                      <ArrowRight
                        className={`w-2.5 h-2.5 shrink-0 transition-colors ${
                          activeStepIndex === idx ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
