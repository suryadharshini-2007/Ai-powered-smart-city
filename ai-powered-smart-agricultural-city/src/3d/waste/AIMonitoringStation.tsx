import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, ShieldCheck, Wifi, Eye } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface AIMonitoringStationProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const AIMonitoringStation: React.FC<AIMonitoringStationProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const radarRef = useRef<THREE.Mesh>(null);
  const droneRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Radar dish sweep
    if (radarRef.current) {
      radarRef.current.rotation.y = t * 1.5;
    }

    // Drone gentle hover patrol over station
    if (droneRef.current) {
      droneRef.current.position.y = 8.5 + Math.sin(t * 2.5) * 0.25;
      droneRef.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group
      position={[-8.5, 0, 8.5]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode({
          id: 'waste-ai-command-station',
          name: 'AI Operations Command & Neural Monitoring Hub',
          category: 'Supervisory Control & Data Acquisition (SCADA)',
          status: 'optimal',
          efficiency: 99.8,
          powerKw: 14.2,
          description:
            'Elevated multi-sensor observation facility coordinating edge AI sorting algorithms, robot rover fleet trajectories, dynamic bin fill alerts, and citywide diversion telemetry.',
          telemetryFields: [
            { label: 'Neural Vision Core', value: 'Edge AI v4.8 (1,200 fps)' },
            { label: 'Fleet Telemetry', value: '3 Autonomous Units Active' },
            { label: 'Citywide Diversion', value: '94.2% Away from Landfill' },
            { label: 'Grid Communications', value: '5G Ultra-Low-Latency MESH' },
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
      {/* 1. Structural Concrete Tower Base */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.8, 5.0, 8]} />
        <meshStandardMaterial
          color={isNight ? '#0b1120' : '#1e293b'}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* 2. Elevated Octagonal Glass Control Pod */}
      <group position={[0, 5.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[2.8, 2.2, 1.8, 8]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Panoramic Glass Ribbon */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.82, 2.22, 0.9, 8]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.65}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 3. Roof Antenna Mast & Radar Dish */}
      <mesh position={[0, 6.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>

      <mesh ref={radarRef} position={[0, 7.3, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} />
      </mesh>

      {/* 4. Autonomous Aerial Surveying Drone Hovering Above */}
      <group ref={droneRef} position={[0, 8.5, 0]}>
        {/* Central pod */}
        <mesh>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* 4 Rotor Arms */}
        {[-0.35, 0.35].map((dx, dxIdx) =>
          [-0.35, 0.35].map((dz, dzIdx) => (
            <group key={`drone-rotor-${dxIdx}-${dzIdx}`} position={[dx, 0.05, dz]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
            </group>
          ))
        )}
        {/* Scanning Spotlight down from drone */}
        <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.2, 3.0, 16, 1, true]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Floating Station Tag */}
      <Html position={[0, 7.9, 0]} center distanceFactor={8} className="pointer-events-none select-none">
        <div className="bg-slate-950/90 border border-teal-400 px-3 py-1 rounded-xl text-[10px] font-mono text-teal-300 font-bold flex items-center gap-1.5 shadow-2xl whitespace-nowrap">
          <Eye className="w-3.5 h-3.5 text-teal-400" />
          AI MONITORING & SCADA STATION
        </div>
      </Html>
    </group>
  );
};
