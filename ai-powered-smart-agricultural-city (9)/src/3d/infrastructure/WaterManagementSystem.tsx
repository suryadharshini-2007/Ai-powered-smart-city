import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  RotateCw,
  Gauge,
  Waves,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { WaterInfrastructureData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface WaterManagementSystemProps {
  waterData: WaterInfrastructureData;
  onToggleLeak: () => void;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const WaterManagementSystem: React.FC<WaterManagementSystemProps> = ({
  waterData,
  onToggleLeak,
  onSelectNode,
  isNight = false,
}) => {
  const waterSurfaceRef = useRef<THREE.Mesh>(null);
  const leakMistRef = useRef<THREE.Group>(null);
  const acousticWaveRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Water level gentle wave oscillation inside tank
    if (waterSurfaceRef.current) {
      waterSurfaceRef.current.position.y =
        1.8 * (waterData.waterLevelPercent / 100) + Math.sin(t * 1.5) * 0.04;
    }

    // Leak mist spray animation if leak active and not isolated
    if (leakMistRef.current && waterData.hasActiveLeak && !waterData.valveIsolated) {
      leakMistRef.current.rotation.y = t * 4;
      leakMistRef.current.scale.setScalar(1.0 + Math.sin(t * 8) * 0.25);
    }

    // Acoustic sensor wave ring expansion
    if (acousticWaveRef.current) {
      if (waterData.hasActiveLeak && !waterData.valveIsolated) {
        const s = (t * 2) % 1;
        acousticWaveRef.current.scale.set(1 + s * 2, 1, 1 + s * 2);
        (acousticWaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - s);
      } else {
        acousticWaveRef.current.scale.set(1, 1, 1);
        (acousticWaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  });

  return (
    <group position={[-10.5, 0, 7.5]}>
      {/* ========================================================= */}
      {/* 1. MUNICIPAL WATER RESERVOIR & FILTRATION TOWER */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          infraSounds.playClick();
          onSelectNode({
            id: 'infra-water-reservoir',
            name: 'Smart Hydro-Buffer & Acoustic Leak Sensing Station',
            category: 'Water Management & Security',
            status: waterData.hasActiveLeak ? 'critical' : 'optimal',
            efficiency: 99.4,
            powerKw: 12.8,
            description:
              'Central municipal smart water buffer integrating rainwater harvesting, biological membrane recycling, and subterranean acoustic fiber-optic leak detection arrays.',
            telemetryFields: [
              { label: 'Water Level', value: `${waterData.waterLevelPercent}% (145,000 L)` },
              { label: 'Daily Usage', value: `${waterData.dailyUsageLiters.toLocaleString()} L` },
              { label: 'Rainwater Collected', value: `${waterData.rainwaterCollectedLiters.toLocaleString()} L` },
              { label: 'Recycled Water Ratio', value: `${waterData.recycledWaterPercent}%` },
              {
                label: 'Leak Status',
                value: waterData.hasActiveLeak
                  ? `ANOMALY: ${waterData.leakJunction} (${waterData.leakRateLpm} L/min)`
                  : 'Normal (0 Leaks Detected)',
              },
              { label: 'Acoustic Sensors', value: '32 Hydrophone Nodes Active' },
              { label: 'Smart Isolation Valve', value: waterData.valveIsolated ? 'Closed (Leak Isolated)' : 'Open (Nominal)' },
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
        {/* Concrete Platform */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[3.4, 3.6, 0.2, 24]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Elevated Transparent Glass Hydro-Tank Column */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[2.2, 2.2, 4.0, 24]} />
          <meshStandardMaterial
            color="#0284c7"
            transparent
            opacity={0.35}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Inner Water Body with Dynamic Level */}
        <mesh
          position={[0, 0.2 + (1.9 * (waterData.waterLevelPercent / 100)) / 2, 0]}
        >
          <cylinderGeometry
            args={[2.15, 2.15, 1.9 * (waterData.waterLevelPercent / 100), 24]}
          />
          <meshStandardMaterial
            color="#0ea5e9"
            transparent
            opacity={0.75}
            roughness={0.1}
          />
        </mesh>

        {/* Tank Roof Dome */}
        <mesh position={[0, 4.2, 0]}>
          <sphereGeometry args={[2.2, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#0369a1" metalness={0.8} />
        </mesh>

        {/* Vertical Water Pipe with Flow Valve */}
        <mesh position={[2.5, 1.8, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 3.6, 12]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>

        {/* Automated Smart Isolation Valve Motor */}
        <mesh position={[2.5, 1.8, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={waterData.valveIsolated ? '#ef4444' : '#10b981'}
            emissive={waterData.valveIsolated ? '#ef4444' : '#10b981'}
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* Acoustic Wave Ring Expanding at Pipe Base during Leak */}
        <mesh ref={acousticWaveRef} position={[2.5, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.5, 24]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        {/* 3D Animated Leak Mist Particles (Visible when leak active) */}
        {waterData.hasActiveLeak && !waterData.valveIsolated && (
          <group ref={leakMistRef} position={[2.5, 0.8, 0.3]}>
            {[-0.2, 0, 0.2].map((mx, mIdx) => (
              <mesh key={`mist-${mIdx}`} position={[mx, 0.1 * mIdx, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
              </mesh>
            ))}
          </group>
        )}

        {/* ========================================================= */}
        {/* FLOATING 3D WATER TELEMETRY HUD & LEAK CONTROLLER */}
        {/* ========================================================= */}
        <Html
          position={[0, 5.6, 0]}
          center
          distanceFactor={7.5}
          className="select-none pointer-events-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-76 bg-slate-950/95 backdrop-blur-xl border border-sky-400/80 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(56,189,248,0.35)] text-slate-100 font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  <Droplets className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[10px] text-sky-400 font-extrabold uppercase tracking-wider">
                    WATER INFRASTRUCTURE
                  </div>
                  <div className="text-xs font-bold text-white">Smart Hydro-Buffer #01</div>
                </div>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  waterData.hasActiveLeak && !waterData.valveIsolated
                    ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                }`}
              >
                {waterData.hasActiveLeak && !waterData.valveIsolated
                  ? 'LEAK DETECTED'
                  : 'NOMINAL'}
              </span>
            </div>

            {/* Required Prompt Specs:
                - Water Level
                - Daily Usage
                - Rainwater Collected
                - Recycled Water
                - Leak Status */}
            <div className="space-y-1.5 mb-2.5 text-[11px]">
              {/* Water Level */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-sky-400" />
                  Water Level:
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${waterData.waterLevelPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-sky-300">
                    {waterData.waterLevelPercent}%
                  </span>
                </div>
              </div>

              {/* Daily Usage */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  Daily Usage:
                </span>
                <span className="font-bold text-slate-200">
                  {waterData.dailyUsageLiters.toLocaleString()} L
                </span>
              </div>

              {/* Rainwater Collected */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  Rainwater Collected:
                </span>
                <span className="font-bold text-emerald-300">
                  {waterData.rainwaterCollectedLiters.toLocaleString()} L
                </span>
              </div>

              {/* Recycled Water */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-teal-400" />
                  Recycled Water:
                </span>
                <span className="font-bold text-teal-300">
                  {waterData.recycledWaterPercent}%
                </span>
              </div>

              {/* Leak Status */}
              <div
                className={`p-2 rounded-xl border text-[10px] ${
                  waterData.hasActiveLeak && !waterData.valveIsolated
                    ? 'bg-red-950/80 border-red-500/80 text-red-200 animate-pulse'
                    : waterData.valveIsolated
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-200'
                    : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {waterData.hasActiveLeak && !waterData.valveIsolated ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span>
                    {waterData.hasActiveLeak && !waterData.valveIsolated
                      ? `ACOUSTIC ALERT: Fissure (${waterData.leakRateLpm} L/min)`
                      : waterData.valveIsolated
                      ? 'VALVE ISOLATED: Leak Contained'
                      : 'LEAK STATUS: 0 Anomalies (Secure)'}
                  </span>
                </div>
                {waterData.hasActiveLeak && (
                  <div className="text-[9px] text-slate-300 mt-1">
                    Junction: {waterData.leakJunction}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Leak Simulation Button */}
            <button
              type="button"
              onClick={() => {
                if (waterData.hasActiveLeak) {
                  infraSounds.playValveClose();
                } else {
                  infraSounds.playLeakAlarm();
                }
                onToggleLeak();
              }}
              className={`w-full py-2 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                waterData.hasActiveLeak
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {waterData.hasActiveLeak
                  ? 'ACTUATE VALVE & RESOLVE LEAK'
                  : 'DEMONSTRATE LEAK DETECTION'}
              </span>
            </button>
          </div>
        </Html>
      </group>
    </group>
  );
};
