import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Lightbulb, Zap, Activity, Radio, SunMedium, Eye } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { StreetlightData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface SmartStreetlightsProps {
  streetlights: StreetlightData[];
  selectedLightId: string | null;
  onSelectLight: (light: StreetlightData) => void;
  onToggleLightForce: (lightId: string) => void;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SmartStreetlights: React.FC<SmartStreetlightsProps> = ({
  streetlights,
  selectedLightId,
  onSelectLight,
  onToggleLightForce,
  onSelectNode,
  isNight = false,
}) => {
  return (
    <group>
      {streetlights.map((light) => {
        const isSelected = selectedLightId === light.id;
        const normalizedBrightness = light.brightness / 100;

        return (
          <group
            key={light.id}
            position={light.position}
            rotation={[0, light.orientation, 0]}
            onClick={(e) => {
              e.stopPropagation();
              infraSounds.playLightTrigger();
              onSelectLight(light);
              onSelectNode({
                id: light.id,
                name: light.name,
                category: 'Smart Municipal Lighting',
                status: light.motionDetected ? 'optimal' : 'normal',
                efficiency: 99.2,
                powerKw: Number((light.energyConsumptionWatts / 1000).toFixed(3)),
                description:
                  'High-efficiency solid-state LED luminaire with integrated 24GHz mmWave radar motion detection. Features autonomous dimming to minimize light pollution and grid draw, brightening dynamically upon pedestrian or autonomous vehicle approach.',
                telemetryFields: [
                  { label: 'Light ID', value: light.lightId },
                  { label: 'Brightness Output', value: `${light.brightness}% (${Math.round(light.brightness * 12)} lm)` },
                  { label: 'Energy Draw', value: `${light.energyConsumptionWatts} W` },
                  {
                    label: 'Motion Detection',
                    value: light.motionDetected
                      ? `Target In Range (${light.approachingEntity || 'Vehicle/Pedestrian'})`
                      : 'Standby Radar Scanning',
                  },
                  { label: 'Operating Mode', value: light.status },
                  { label: 'Color Temperature', value: '4,000 K (High-CRI)' },
                  { label: 'Adaptive Power Savings', value: '78.5% Saved' },
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
            {/* Base Flange & Concrete Foundation */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.35, 0.45, 0.3, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Vertical Pole Column */}
            <mesh position={[0, 2.7, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.16, 5.2, 12]} />
              <meshStandardMaterial
                color={isNight ? '#0f172a' : '#334155'}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Radar Motion Sensor Ring on Pole */}
            <mesh position={[0, 3.8, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
              <meshStandardMaterial
                color={light.motionDetected ? '#10b981' : '#0284c7'}
                emissive={light.motionDetected ? '#10b981' : '#0284c7'}
                emissiveIntensity={light.motionDetected ? 2.5 : 0.8}
              />
            </mesh>

            {/* Arching Cantilever Arm extending toward the road */}
            <group position={[0, 5.2, 0]}>
              {/* Horizontal Arm */}
              <mesh position={[0, 0.3, -1.0]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.12, 0.12, 2.2]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>

              {/* Luminaire Head Fixture */}
              <mesh position={[0, 0.08, -1.9]} rotation={[-0.1, 0, 0]} castShadow>
                <boxGeometry args={[0.45, 0.15, 0.9]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Glowing LED Array Surface */}
              <mesh position={[0, -0.01, -1.9]} rotation={[-0.1, 0, 0]}>
                <planeGeometry args={[0.38, 0.8]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#fef08a"
                  emissiveIntensity={0.5 + normalizedBrightness * 3.5}
                />
              </mesh>

              {/* Downward Light Cone (Subtle volumetric visual effect) */}
              <mesh position={[0, -2.6, -1.9]} rotation={[0, 0, 0]}>
                <coneGeometry args={[2.2 * normalizedBrightness, 5.2, 16, 1, true]} />
                <meshBasicMaterial
                  color="#fef9c3"
                  transparent
                  opacity={0.03 + normalizedBrightness * 0.14}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>

              {/* Dynamic Spot Light projecting onto road surface */}
              <spotLight
                position={[0, 0, -1.9]}
                target-position={[0, -5.2, -1.9]}
                angle={0.7}
                penumbra={0.6}
                intensity={(isNight ? 4.5 : 2.0) * normalizedBrightness}
                color="#fef08a"
                distance={14}
                castShadow
              />
            </group>

            {/* Road Surface Illuminated Pool Indicator */}
            <mesh position={[0, 0.03, -1.9]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.2 * normalizedBrightness, 24]} />
              <meshBasicMaterial
                color="#fef08a"
                transparent
                opacity={0.06 + normalizedBrightness * 0.16}
                depthWrite={false}
              />
            </mesh>

            {/* Floating 3D Telemetry HUD above Luminaire */}
            {isSelected && (
              <Html
                position={[0, 6.6, -1.2]}
                center
                distanceFactor={7.5}
                className="select-none pointer-events-auto"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-72 bg-slate-950/95 backdrop-blur-xl border border-amber-400/80 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(245,158,11,0.35)] text-slate-100 font-mono"
                >
                  {/* Title & Light ID */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <Lightbulb className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                          SMART STREETLIGHT
                        </div>
                        <div className="text-xs font-bold text-white">{light.lightId}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        light.motionDetected
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 animate-pulse'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {light.status}
                    </span>
                  </div>

                  {/* Required Prompt Specs:
                      - Light ID
                      - Brightness
                      - Energy Consumption
                      - Motion Detection
                      - Status */}
                  <div className="space-y-2 mb-3 text-[11px]">
                    {/* Brightness */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                        Brightness:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${light.brightness}%` }}
                          />
                        </div>
                        <span className="font-bold text-amber-300">{light.brightness}%</span>
                      </div>
                    </div>

                    {/* Energy Consumption */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-sky-400" />
                        Energy Consumption:
                      </span>
                      <span className="font-bold text-sky-300">
                        {light.energyConsumptionWatts} W
                      </span>
                    </div>

                    {/* Motion Detection */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-emerald-400" />
                        Motion Detection:
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          light.motionDetected ? 'text-emerald-300' : 'text-slate-400'
                        }`}
                      >
                        {light.motionDetected ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {light.approachingEntity || 'Active Trigger'}
                          </>
                        ) : (
                          'Idle (No Motion)'
                        )}
                      </span>
                    </div>

                    {/* Operational Status */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        Adaptive Mode:
                      </span>
                      <span className="font-bold text-purple-300">
                        {light.brightness > 50 ? 'High-Beam (Motion)' : 'Eco-Standby (25%)'}
                      </span>
                    </div>
                  </div>

                  {/* Manual Test / Override Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      infraSounds.playLightTrigger();
                      onToggleLightForce(light.id);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <SunMedium className="w-3.5 h-3.5" />
                    <span>
                      {light.brightness >= 90
                        ? 'DIM TO ECO STANDBY (25%)'
                        : 'SIMULATE APPROACH (RAMP TO 100%)'}
                    </span>
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
