import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Video, ShieldCheck, Users, Car, Eye, Bell, AlertTriangle } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { CCTVCameraData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface CCTVAndSafetySystemProps {
  cameras: CCTVCameraData[];
  selectedCameraId: string | null;
  onSelectCamera: (cam: CCTVCameraData) => void;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const CCTVAndSafetySystem: React.FC<CCTVAndSafetySystemProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera,
  onSelectNode,
  isNight = false,
}) => {
  const cameraHeadsRef = useRef<{ [key: string]: THREE.Group | null }>({});
  const sosBeaconRef = useRef<THREE.Mesh>(null);

  // Animate camera rotation & SOS strobe
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotate camera heads back and forth (pan oscillation)
    cameras.forEach((cam, idx) => {
      const head = cameraHeadsRef.current[cam.id];
      if (head) {
        // Oscillate smoothly within range
        const panRange = cam.panAngleRange[1] - cam.panAngleRange[0];
        const angle = Math.sin(t * 0.8 + idx * 1.5) * (panRange * 0.5);
        head.rotation.y = angle;
      }
    });

    // SOS beacon strobe rotation
    if (sosBeaconRef.current) {
      sosBeaconRef.current.rotation.y = t * 5;
    }
  });

  return (
    <group>
      {/* CCTV Cameras */}
      {cameras.map((cam) => {
        const isSelected = selectedCameraId === cam.id;

        return (
          <group
            key={cam.id}
            position={cam.position}
            onClick={(e) => {
              e.stopPropagation();
              infraSounds.playCCTVPing();
              onSelectCamera(cam);
              onSelectNode({
                id: cam.id,
                name: `Autonomous Security Sensor (${cam.cameraId})`,
                category: 'Public Safety & AI Vision',
                status: 'optimal',
                efficiency: 99.8,
                powerKw: 0.045,
                description:
                  'Multi-spectral 4K high-dynamic-range AI vision station. Continuously tracks vehicular trajectories, pedestrian crosswalk queues, and perimeter anomalies with edge-computed zero-cloud latency privacy masking.',
                telemetryFields: [
                  { label: 'Camera ID', value: cam.cameraId },
                  { label: 'Location', value: cam.location },
                  { label: 'People Detected', value: `${cam.peopleDetected} Pedestrians` },
                  { label: 'Vehicles Detected', value: `${cam.vehiclesDetected} Connected EVs` },
                  { label: 'Safety Status', value: cam.safetyStatus },
                  { label: 'Resolution & FPS', value: '3840x2160 @ 60 FPS' },
                  { label: 'Thermal Infrared', value: 'Enabled (Human Detection)' },
                  { label: 'Privacy Masking', value: 'Edge Anonymization Active' },
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
            {/* Wall / Pole Mount Bracket */}
            <mesh position={[0, 0, 0.2]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.35]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>

            {/* Swivel Gimbal Joint */}
            <mesh position={[0, -0.15, 0.35]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.9} />
            </mesh>

            {/* Rotating Camera Head Body */}
            <group
              ref={(el) => {
                cameraHeadsRef.current[cam.id] = el;
              }}
              position={[0, -0.3, 0.4]}
            >
              {/* Camera Housing Enclosure */}
              <mesh rotation={[0.25, 0, 0]} castShadow>
                <boxGeometry args={[0.3, 0.26, 0.6]} />
                <meshStandardMaterial
                  color={isNight ? '#0b1120' : '#1e293b'}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>

              {/* Sun Shield Visor */}
              <mesh position={[0, 0.16, 0.05]} rotation={[0.25, 0, 0]}>
                <boxGeometry args={[0.34, 0.04, 0.65]} />
                <meshStandardMaterial color="#0284c7" metalness={0.9} />
              </mesh>

              {/* Optical Lens Cylinder */}
              <mesh position={[0, -0.05, -0.32]} rotation={[Math.PI / 2 + 0.25, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.15, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.95} />
              </mesh>

              {/* Lens Optical Reflection / Eye */}
              <mesh position={[0, -0.07, -0.4]} rotation={[0.25, 0, 0]}>
                <circleGeometry args={[0.07, 16]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#38bdf8"
                  emissiveIntensity={1.8}
                />
              </mesh>

              {/* Conical AI Vision Scanning Beam */}
              <mesh position={[0, -1.8, -3.2]} rotation={[Math.PI / 4, 0, 0]}>
                <coneGeometry args={[1.6, 4.8, 16, 1, true]} />
                <meshBasicMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0.05}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            </group>

            {/* Floating 3D Telemetry HUD */}
            {isSelected && (
              <Html
                position={[0, 1.4, 0]}
                center
                distanceFactor={7.5}
                className="select-none pointer-events-auto"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-72 bg-slate-950/95 backdrop-blur-xl border border-sky-400/80 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(56,189,248,0.35)] text-slate-100 font-mono"
                >
                  {/* Header Title & Camera ID */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
                        <Video className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] text-sky-400 font-extrabold uppercase tracking-wider">
                          AI SURVEILLANCE CCTV
                        </div>
                        <div className="text-xs font-bold text-white">{cam.cameraId}</div>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  </div>

                  {/* Required Prompt Specs:
                      - Camera ID
                      - Location
                      - People Detected
                      - Vehicles Detected
                      - Safety Status */}
                  <div className="space-y-2 mb-3 text-[11px]">
                    {/* Location */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <div className="text-[9px] text-slate-400 uppercase mb-0.5">Location:</div>
                      <div className="text-slate-200 font-bold text-xs">{cam.location}</div>
                    </div>

                    {/* People Detected */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        People Detected:
                      </span>
                      <span className="font-bold text-sky-300">
                        {cam.peopleDetected} Pedestrians
                      </span>
                    </div>

                    {/* Vehicles Detected */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-amber-400" />
                        Vehicles Detected:
                      </span>
                      <span className="font-bold text-amber-300">
                        {cam.vehiclesDetected} Connected EVs
                      </span>
                    </div>

                    {/* Safety Status */}
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Safety Status:
                      </span>
                      <span className="font-bold text-emerald-300">{cam.safetyStatus}</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-sky-400" />
                    <span>Real-time optical panning with autonomous object bounding boxes.</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Public Safety Emergency SOS Call Station */}
      <group
        position={[-1.2, 0, 4.5]}
        onClick={(e) => {
          e.stopPropagation();
          infraSounds.playCCTVPing();
          onSelectNode({
            id: 'public-safety-sos-01',
            name: 'Civic Smart Emergency SOS Dispatch Pillar',
            category: 'Public Safety Systems',
            status: 'optimal',
            efficiency: 99.9,
            powerKw: 0.08,
            description:
              'Direct-to-police/medic two-way emergency intercom with dual 360° omnidirectional high-definition cameras, automated defibrillator cabinet, and high-intensity blue civic beacon.',
            telemetryFields: [
              { label: 'Station ID', value: 'SOS-CIVIC-01' },
              { label: 'Dispatch Response', value: 'Sub-90s Autonomous Drone / Patrol' },
              { label: 'High-Decibel Siren', value: '110 dB Dual-Horn Ready' },
              { label: 'Cellular Uplink', value: 'Priority FirstNet Band 14' },
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
        {/* Post Column */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.35, 2.8, 0.35]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>

        {/* SOS Push Button Panel */}
        <mesh position={[0, 1.4, 0.18]}>
          <boxGeometry args={[0.26, 0.4, 0.04]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>

        {/* Flashing Blue Top Beacon */}
        <mesh ref={sosBeaconRef} position={[0, 2.95, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.28, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.5}
          />
        </mesh>

        <pointLight position={[0, 3.1, 0]} intensity={1.5} color="#38bdf8" distance={4} />

        {/* Small floating label */}
        <Html position={[0, 3.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-slate-950/80 border border-sky-400 px-2 py-0.5 rounded-full text-[8px] font-mono text-sky-200 flex items-center gap-1 shadow-md">
            <Bell className="w-2.5 h-2.5 text-sky-400" />
            SOS CALL POINT
          </div>
        </Html>
      </group>
    </group>
  );
};
