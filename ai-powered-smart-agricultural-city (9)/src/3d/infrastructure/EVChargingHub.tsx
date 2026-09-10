import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Zap,
  BatteryCharging,
  Car,
  CheckCircle2,
  Play,
  Pause,
  Activity,
  Gauge,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { EVChargerData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface EVChargingHubProps {
  chargers: EVChargerData[];
  selectedChargerId: string | null;
  onSelectCharger: (charger: EVChargerData) => void;
  onToggleCharging: (chargerId: string) => void;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const EVChargingHub: React.FC<EVChargingHubProps> = ({
  chargers,
  selectedChargerId,
  onSelectCharger,
  onToggleCharging,
  onSelectNode,
  isNight = false,
}) => {
  const cablePulseRef = useRef<{ [key: string]: THREE.Mesh | null }>({});

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse cable electrons if charging
    chargers.forEach((ch) => {
      const mesh = cablePulseRef.current[ch.id];
      if (mesh && ch.isCharging) {
        mesh.position.z = -0.4 + (Math.sin(t * 8) * 0.3);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 12) * 0.4;
      }
    });
  });

  return (
    <group position={[10.5, 0, -7.5]}>
      {/* Paved Parking Pad with Green EV Markings */}
      <mesh position={[2.0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.1, 4.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* EV Green Parking Bay Stripes */}
      {[-1.8, 2.2].map((bx, bIdx) => (
        <mesh key={`bay-mark-${bIdx}`} position={[bx, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 4.2]} />
          <meshStandardMaterial color="#065f46" roughness={0.5} />
        </mesh>
      ))}

      {chargers.map((ch, idx) => {
        const isSelected = selectedChargerId === ch.id;
        const offsetX = idx === 0 ? -1.8 : 2.2;

        return (
          <group
            key={ch.id}
            position={[offsetX, 0, -1.8]}
            onClick={(e) => {
              e.stopPropagation();
              infraSounds.playEVChargePulse();
              onSelectCharger(ch);
              onSelectNode({
                id: ch.id,
                name: `Autonomous Ultra-Fast DC Charger (${ch.stationId})`,
                category: 'Clean Transport & EV Infrastructure',
                status: 'optimal',
                efficiency: 98.9,
                powerKw: ch.isCharging ? ch.chargingPowerKw : 0.8,
                description:
                  'Liquid-cooled 350 kW Megawatt-ready DC fast charging dispenser with robotic plug-in guidance, dynamic grid balance throttled by solar BESS state-of-charge.',
                telemetryFields: [
                  { label: 'Charging Station', value: ch.stationName },
                  { label: 'Docked Vehicle', value: ch.vehicleModel },
                  { label: 'Battery SoC', value: `${ch.batteryPercent}% (${ch.isCharging ? 'Rising' : 'Standby'})` },
                  { label: 'Charging Power', value: `${ch.isCharging ? ch.chargingPowerKw : 0} kW` },
                  { label: 'Operating Status', value: ch.status },
                  { label: 'Coolant Flow', value: 'Propylene Glycol Active (18 °C)' },
                  { label: 'ISO 15118-20 Plug & Charge', value: 'Encrypted Handshake Complete' },
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
            {/* 1. Charger Tower Dispenser */}
            <mesh position={[0, 1.3, 0]} castShadow>
              <boxGeometry args={[0.7, 2.4, 0.5]} />
              <meshStandardMaterial
                color={isNight ? '#0b1120' : '#1e293b'}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing Status LED Bar */}
            <mesh position={[0, 1.8, 0.26]}>
              <planeGeometry args={[0.5, 0.1]} />
              <meshBasicMaterial color={ch.isCharging ? '#10b981' : '#38bdf8'} />
            </mesh>

            {/* Dispenser Touchscreen Display */}
            <mesh position={[0, 1.4, 0.26]}>
              <planeGeometry args={[0.45, 0.35]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={1.2}
              />
            </mesh>

            {/* Liquid Cooled Charging Cable extending to vehicle */}
            <mesh position={[0, 0.8, 0.8]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>

            {/* Cable Electron Pulse (Animated) */}
            {ch.isCharging && (
              <mesh
                ref={(el) => {
                  cablePulseRef.current[ch.id] = el;
                }}
                position={[0, 0.8, 0.8]}
              >
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
            )}

            {/* 2. Docked Futuristic Autonomous EV Model */}
            <group position={[0, 0, 2.3]}>
              {/* Vehicle Body Chassis */}
              <mesh position={[0, 0.55, 0]} castShadow>
                <boxGeometry args={[1.7, 0.7, 3.2]} />
                <meshStandardMaterial
                  color={idx === 0 ? '#0284c7' : '#0d9488'}
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>

              {/* Aerodynamic Cabin Glass */}
              <mesh position={[0, 0.95, -0.2]} castShadow>
                <boxGeometry args={[1.4, 0.5, 1.8]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0.7}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>

              {/* Headlights */}
              <mesh position={[-0.6, 0.55, 1.61]}>
                <planeGeometry args={[0.3, 0.1]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0.6, 0.55, 1.61]}>
                <planeGeometry args={[0.3, 0.1]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>

              {/* Underglow Neon (Pulsing during charging) */}
              {ch.isCharging && (
                <pointLight
                  position={[0, 0.2, 0]}
                  intensity={2.5}
                  color="#10b981"
                  distance={3}
                />
              )}
            </group>

            {/* ========================================================= */}
            {/* 3D TELEMETRY HUD OVER CHARGER */}
            {/* ========================================================= */}
            {isSelected && (
              <Html
                position={[0, 3.2, 0]}
                center
                distanceFactor={7.5}
                className="select-none pointer-events-auto"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-72 bg-slate-950/95 backdrop-blur-xl border border-emerald-400/80 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(16,185,129,0.35)] text-slate-100 font-mono"
                >
                  {/* Header Title */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <BatteryCharging className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">
                          EV HYPER-CHARGER
                        </div>
                        <div className="text-xs font-bold text-white">{ch.stationId}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        ch.isCharging
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 animate-pulse'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {ch.isCharging ? 'CHARGING' : 'IDLE'}
                    </span>
                  </div>

                  {/* Required Prompt Specs:
                      - Charging Station
                      - Vehicle
                      - Battery
                      - Charging Power
                      - Status */}
                  <div className="space-y-1.5 mb-2.5 text-[11px]">
                    {/* Charging Station */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <div className="text-[9px] text-slate-400 uppercase mb-0.5">Station:</div>
                      <div className="text-slate-200 font-bold text-xs">{ch.stationName}</div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-sky-400" />
                        Vehicle:
                      </span>
                      <span className="font-bold text-sky-300">{ch.vehicleModel}</span>
                    </div>

                    {/* Battery */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                        Battery:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${ch.batteryPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-emerald-300">
                          {ch.batteryPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Charging Power */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Charging Power:
                      </span>
                      <span className="font-bold text-amber-300">
                        {ch.isCharging ? `${ch.chargingPowerKw} kW DC` : '0 kW (Idle)'}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        Status:
                      </span>
                      <span className="font-bold text-purple-300">{ch.status}</span>
                    </div>
                  </div>

                  {/* Toggle Charging Animation Button */}
                  <button
                    type="button"
                    onClick={() => {
                      infraSounds.playEVChargePulse();
                      onToggleCharging(ch.id);
                    }}
                    className={`w-full py-2 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      ch.isCharging
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    }`}
                  >
                    {ch.isCharging ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>PAUSE CHARGING</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>START FAST CHARGE ANIMATION</span>
                      </>
                    )}
                  </button>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
