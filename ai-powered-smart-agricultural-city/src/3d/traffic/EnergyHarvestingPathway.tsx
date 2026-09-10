import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { EnergyPathwayStats } from './TrafficTypes';

interface EnergyHarvestingPathwayProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const EnergyHarvestingPathway: React.FC<EnergyHarvestingPathwayProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const [stats, setStats] = useState<EnergyPathwayStats>({
    footsteps: 128,
    mechanicalKj: 42.5,
    electricalKj: 11.8,
    efficiencyPercent: 27.8,
  });

  const [activeTileIndex, setActiveTileIndex] = useState(0);
  const pedRef = useRef<THREE.Group>(null);
  const pulseRingsRef = useRef<THREE.Group>(null);

  // Continuously increment footsteps and energy as pedestrian walks
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        footsteps: prev.footsteps + 1,
        mechanicalKj: +(prev.mechanicalKj + 0.33).toFixed(1),
        electricalKj: +(prev.electricalKj + 0.09).toFixed(1),
        efficiencyPercent: 27.8,
      }));
      setActiveTileIndex((prev) => (prev + 1) % 6);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1.8;
    // Animate commuter pacing back and forth along pathway (x from 10 to 18, z = -12)
    if (pedRef.current) {
      const walkX = 10.5 + (Math.sin(t) * 0.5 + 0.5) * 7.0;
      pedRef.current.position.x = walkX;
      pedRef.current.rotation.y = Math.cos(t) > 0 ? Math.PI / 2 : -Math.PI / 2;
      pedRef.current.position.y = 0.12 + Math.abs(Math.sin(t * 5)) * 0.07;
    }
  });

  const handleSelect = () => {
    onSelectNode({
      id: 'kinetic-energy-pathway-01',
      name: 'Piezoelectric Kinetic Energy Pathway',
      category: 'Renewable Smart Microgrid',
      status: 'optimal',
      efficiency: stats.efficiencyPercent,
      powerKw: +(stats.electricalKj * 0.04).toFixed(2),
      description: 'Modular civic sidewalk floor tiles embedded with electromagnetic & piezoceramic transducers. Converts human kinetic footsteps into clean electrical energy storing directly into city battery banks.',
      telemetryFields: [
        { label: 'Footsteps Detected', value: `${stats.footsteps}` },
        { label: 'Mechanical Energy', value: `${stats.mechanicalKj}`, unit: 'kJ' },
        { label: 'Electrical Energy', value: `${stats.electricalKj}`, unit: 'kJ' },
        { label: 'Harvesting Efficiency', value: `${stats.efficiencyPercent}%` },
        { label: 'Grid Destination', value: 'Streetlight LED Bank' },
      ],
    });
  };

  return (
    <group
      position={[14, 0.12, -12]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Bed frame for kinetic walkway (Length: 8.5m, Width: 2.6m) */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.06, 2.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 6 Piezoelectric Floor Tiles with glowing active state */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const xPos = -3.5 + idx * 1.4;
        const isActive = activeTileIndex === idx;

        return (
          <group key={`tile-${idx}`} position={[xPos, 0.06, 0]}>
            {/* Tile Body */}
            <mesh receiveShadow>
              <boxGeometry args={[1.2, 0.04, 2.2]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            {/* Glowing Hexagonal/Linear Transducer Core */}
            <mesh position={[0, 0.025, 0]}>
              <boxGeometry args={[0.9, 0.01, 1.8]} />
              <meshStandardMaterial
                color={isActive ? '#10b981' : '#0284c7'}
                emissive={isActive ? '#10b981' : '#0284c7'}
                emissiveIntensity={isActive ? (isNight ? 2.5 : 1.8) : (isNight ? 0.7 : 0.3)}
              />
            </mesh>
            {/* Energy Wave Pulse Ring */}
            {isActive && (
              <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.7, 16]} />
                <meshStandardMaterial
                  color="#34d399"
                  emissive="#34d399"
                  emissiveIntensity={2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Walking Pedestrian Generator */}
      <group ref={pedRef} position={[-3, 0.12, 0]}>
        {/* Head */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[0.32, 0.6, 0.2]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.08, 0.38, 0]}>
          <boxGeometry args={[0.12, 0.72, 0.14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.08, 0.38, 0]}>
          <boxGeometry args={[0.12, 0.72, 0.14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Smart Microgrid Capacitor & Display Totem */}
      <group position={[4.8, 0, 0]}>
        {/* Totem Column */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.5, 2.8, 0.5]} />
          <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing Energy Accumulator LED Strip */}
        <mesh position={[0, 1.4, 0.26]}>
          <planeGeometry args={[0.2, 2.2]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={isNight ? 2.2 : 1.4}
          />
        </mesh>

        {/* 3D Telemetry HUD over the Totem */}
        <Html position={[0, 2.6, 0]} center distanceFactor={6} className="pointer-events-none select-none">
          <div className="bg-slate-950/95 border border-emerald-500/60 p-2.5 rounded-lg shadow-xl text-center w-[210px] backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                PIEZOELECTRIC GRID
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] font-mono text-slate-300 space-y-0.5 text-left mb-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Footsteps:</span>
                <span className="font-bold text-white">{stats.footsteps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mech Energy:</span>
                <span className="font-bold text-amber-300">{stats.mechanicalKj} kJ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Elec Energy:</span>
                <span className="font-bold text-emerald-300">{stats.electricalKj} kJ</span>
              </div>
            </div>
            {/* Animated Energy Flow pipeline indicator */}
            <div className="text-[8px] font-mono bg-slate-900 px-1 py-1 rounded text-emerald-400 font-semibold border border-slate-800 leading-tight">
              STEP → MECH → GEN → ELEC → GRID
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
