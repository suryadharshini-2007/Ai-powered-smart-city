import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface SmartTrafficSignalsProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  nsLightState: 'RED' | 'YELLOW' | 'GREEN';
  ewLightState: 'RED' | 'YELLOW' | 'GREEN';
  pedestrianWalk: boolean;
  isNight?: boolean;
}

export const SmartTrafficSignals: React.FC<SmartTrafficSignalsProps> = ({
  onSelectNode,
  nsLightState,
  ewLightState,
  pedestrianWalk,
  isNight = false,
}) => {
  // CCTV camera scanning oscillation
  const cam1Ref = useRef<THREE.Group>(null);
  const cam2Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cam1Ref.current) {
      cam1Ref.current.rotation.y = Math.sin(t * 0.8) * 0.45;
    }
    if (cam2Ref.current) {
      cam2Ref.current.rotation.y = Math.cos(t * 0.8) * 0.45;
    }
  });

  const renderSingleSignalHead = (
    state: 'RED' | 'YELLOW' | 'GREEN',
    isVertical: boolean
  ) => {
    return (
      <group>
        {/* Signal Housing Box */}
        <mesh castShadow>
          <boxGeometry args={[0.35, 1.05, 0.28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Visors & Lenses */}
        {/* Red Lens */}
        <mesh position={[0, 0.32, 0.15]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial
            color={state === 'RED' ? '#ef4444' : '#450a0a'}
            emissive={state === 'RED' ? '#ef4444' : '#000000'}
            emissiveIntensity={state === 'RED' ? (isNight ? 2.5 : 1.8) : 0}
          />
        </mesh>
        {/* Yellow Lens */}
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial
            color={state === 'YELLOW' ? '#eab308' : '#422006'}
            emissive={state === 'YELLOW' ? '#eab308' : '#000000'}
            emissiveIntensity={state === 'YELLOW' ? (isNight ? 2.2 : 1.6) : 0}
          />
        </mesh>
        {/* Green Lens */}
        <mesh position={[0, -0.32, 0.15]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial
            color={state === 'GREEN' ? '#22c55e' : '#052e16'}
            emissive={state === 'GREEN' ? '#22c55e' : '#000000'}
            emissiveIntensity={state === 'GREEN' ? (isNight ? 2.5 : 1.8) : 0}
          />
        </mesh>
      </group>
    );
  };

  const renderPedestrianSignal = (walk: boolean) => (
    <group position={[0, -1.8, 0]}>
      {/* Pedestrian Signal Housing */}
      <mesh>
        <boxGeometry args={[0.26, 0.52, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Don't Walk (Hand/Red) */}
      <mesh position={[0, 0.12, 0.11]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshStandardMaterial
          color={!walk ? '#ef4444' : '#450a0a'}
          emissive={!walk ? '#ef4444' : '#000000'}
          emissiveIntensity={!walk ? 2 : 0}
        />
      </mesh>
      {/* Walk (Person/Green) */}
      <mesh position={[0, -0.12, 0.11]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshStandardMaterial
          color={walk ? '#22c55e' : '#052e16'}
          emissive={walk ? '#22c55e' : '#000000'}
          emissiveIntensity={walk ? 2 : 0}
        />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* POLE 1: South-East Corner (Controls Northbound NS Traffic & Eastbound EW) */}
      <group
        position={[8.5, 0, 8.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'smart-pole-se-01',
            name: 'Smart Infrastructure Mast #SE-01',
            category: 'Smart Traffic Infrastructure',
            status: 'optimal',
            efficiency: 99.4,
            powerKw: 0.18,
            description: 'Intelligent multi-sensor roadside pole featuring 360° LiDAR, 4K AI violation camera, adaptive LED signals, and solar energy harvester.',
            telemetryFields: [
              { label: 'Signal Phase', value: nsLightState },
              { label: 'Pedestrian Walk', value: pedestrianWalk ? 'ACTIVE' : 'WAIT' },
              { label: 'CCTV Stream', value: '4K 60FPS V2X' },
              { label: 'Solar Generation', value: '280 W' },
            ],
          });
        }}
      >
        {/* Base Pillar */}
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.24, 6, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cantilever Arm extending toward NS road */}
        <mesh position={[-2.4, 5.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 4.8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Traffic Light Head facing Northbound Traffic (looking from South) */}
        <group position={[-3.6, 5.2, 0]} rotation={[0, Math.PI, 0]}>
          {renderSingleSignalHead(nsLightState, true)}
        </group>

        {/* Secondary Mast Traffic Light */}
        <group position={[-0.4, 4.2, 0]} rotation={[0, Math.PI, 0]}>
          {renderSingleSignalHead(nsLightState, true)}
        </group>

        {/* Pedestrian Crossing Signal */}
        <group position={[0, 3.2, -0.3]} rotation={[0, -Math.PI / 2, 0]}>
          {renderPedestrianSignal(pedestrianWalk)}
        </group>

        {/* PTZ AI CCTV Camera Assembly */}
        <group ref={cam1Ref} position={[-0.3, 5.8, 0.3]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Camera Lens */}
          <mesh position={[0, -0.05, 0.18]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.12, 16]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
          {/* Subtle Scanning Laser/Frustum */}
          <mesh position={[0, -1.8, 1.8]} rotation={[Math.PI / 3, 0, 0]}>
            <coneGeometry args={[1.2, 3.2, 16, 1, true]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={isNight ? 0.25 : 0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Solar Panel Topper */}
        <group position={[0, 6.2, 0]} rotation={[Math.PI / 6, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.04, 0.8]} />
            <meshStandardMaterial color="#0369a1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* POLE 2: North-West Corner (Controls Southbound NS Traffic & Westbound EW) */}
      <group
        position={[-8.5, 0, -8.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'smart-pole-nw-02',
            name: 'Smart Infrastructure Mast #NW-02',
            category: 'Smart Traffic Infrastructure',
            status: 'optimal',
            efficiency: 99.1,
            powerKw: 0.18,
            description: 'Coordinates traffic sensor grid and speeds analytics through dual optical recognition sensors.',
            telemetryFields: [
              { label: 'Signal Phase', value: nsLightState },
              { label: 'Pedestrian Walk', value: pedestrianWalk ? 'ACTIVE' : 'WAIT' },
              { label: 'Camera State', value: 'PATROL SCAN' },
            ],
          });
        }}
      >
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.24, 6, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.4, 5.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 4.8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Facing Southbound Traffic (looking from North) */}
        <group position={[3.6, 5.2, 0]} rotation={[0, 0, 0]}>
          {renderSingleSignalHead(nsLightState, true)}
        </group>
        <group position={[0.4, 4.2, 0]} rotation={[0, 0, 0]}>
          {renderSingleSignalHead(nsLightState, true)}
        </group>
        <group position={[0, 3.2, 0.3]} rotation={[0, Math.PI / 2, 0]}>
          {renderPedestrianSignal(pedestrianWalk)}
        </group>
        {/* CCTV Camera */}
        <group ref={cam2Ref} position={[0.3, 5.8, -0.3]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.05, -0.18]} rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.12, 16]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
        </group>
        {/* Solar Panel */}
        <group position={[0, 6.2, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.04, 0.8]} />
            <meshStandardMaterial color="#0369a1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* POLE 3: South-West Corner (Controls East-West Eastbound Traffic) */}
      <group position={[-8.5, 0, 8.5]}>
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.24, 6, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 5.6, -2.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 4.8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Facing Eastbound EW Traffic */}
        <group position={[0, 5.2, -3.6]} rotation={[0, Math.PI / 2, 0]}>
          {renderSingleSignalHead(ewLightState, false)}
        </group>
      </group>

      {/* POLE 4: North-East Corner (Controls East-West Westbound Traffic) */}
      <group position={[8.5, 0, -8.5]}>
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.24, 6, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 5.6, 2.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 4.8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Facing Westbound EW Traffic */}
        <group position={[0, 5.2, 3.6]} rotation={[0, -Math.PI / 2, 0]}>
          {renderSingleSignalHead(ewLightState, false)}
        </group>
      </group>
    </group>
  );
};
