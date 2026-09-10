import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Radio, Wifi, Thermometer, Wind, Activity, Globe, Info } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SmartPoleData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface SmartPolesAndTelecomProps {
  poles: SmartPoleData[];
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SmartPolesAndTelecom: React.FC<SmartPolesAndTelecomProps> = ({
  poles,
  onSelectNode,
  isNight = false,
}) => {
  const signalRingRefs = useRef<{ [key: string]: THREE.Mesh | null }>({});

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Concentric 5G wave propagation animation
    poles.forEach((p) => {
      const mesh = signalRingRefs.current[p.poleId];
      if (mesh) {
        const s = (t * 1.2) % 1;
        mesh.scale.set(1 + s * 2.5, 1 + s * 2.5, 1);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - s);
      }
    });
  });

  return (
    <group>
      {poles.map((pole) => (
        <group
          key={pole.poleId}
          position={pole.position}
          onClick={(e) => {
            e.stopPropagation();
            infraSounds.playCCTVPing();
            onSelectNode({
              id: pole.poleId,
              name: pole.name,
              category: 'Telecommunications & Environmental Mesh',
              status: 'optimal',
              efficiency: 99.8,
              powerKw: 0.18,
              description:
                'Integrated multi-sensor municipal pole combining 5G NR microcell transceivers, air quality index laser particle counters, civic digital banner, and automated emergency audio siren.',
              telemetryFields: [
                { label: 'Smart Pole ID', value: pole.poleId },
                { label: 'Air Quality (AQI)', value: `${pole.airQualityAqi} (Excellent / Green)` },
                { label: 'Ambient Temperature', value: `${pole.ambientTempC} °C` },
                { label: '5G Mesh Bandwidth', value: '4.8 Gbps Peak Throughput' },
                { label: 'Radio Protocol', value: pole.telecomCoverage },
                { label: 'Civic Network Status', value: pole.civicStatus },
                { label: 'Particulate Matter', value: 'PM2.5: 8 µg/m³ &bull; PM10: 14 µg/m³' },
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
          {/* Main Integrated Pole Body */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 6.4, 16]} />
            <meshStandardMaterial
              color={isNight ? '#0b1120' : '#1e293b'}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Integrated Vertical Digital Information Display Screen */}
          <mesh position={[0, 2.2, 0.23]}>
            <boxGeometry args={[0.42, 1.4, 0.05]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={1.4}
            />
          </mesh>

          {/* Environmental Sensor Cluster Pod */}
          <mesh position={[0, 4.2, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.35, 16]} />
            <meshStandardMaterial color="#059669" metalness={0.8} />
          </mesh>

          {/* Top 5G Microcell Radome Housing */}
          <mesh position={[0, 6.4, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Concentric 5G Pulse Waves expanding from radome */}
          <mesh
            ref={(el) => {
              signalRingRefs.current[pole.poleId] = el;
            }}
            position={[0, 6.4, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.3, 0.45, 24]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>

          {/* Floating Tag */}
          <Html position={[0, 7.2, 0]} center distanceFactor={8} className="pointer-events-none select-none">
            <div className="bg-slate-950/90 border border-teal-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-teal-300 font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap">
              <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
              SMART POLE &bull; 5G MESH
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};
