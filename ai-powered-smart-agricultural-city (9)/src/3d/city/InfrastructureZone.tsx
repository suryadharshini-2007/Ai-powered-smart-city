import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveZone } from './InteractiveZone';

interface InfrastructureZoneProps {
  position?: [number, number, number];
  onSelect?: () => void;
}

export const InfrastructureZone: React.FC<InfrastructureZoneProps> = ({
  position = [-14, 0, 0],
  onSelect,
}) => {
  const radarDishRef = useRef<THREE.Group>(null);
  const batteryPulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    // Rotating 5G telecom radar dish
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += delta * 0.8;
    }
    // Battery storage breathing glow
    if (batteryPulseRef.current) {
      const material = batteryPulseRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      }
    }
  });

  return (
    <InteractiveZone
      id="infrastructure"
      name="SMART INFRASTRUCTURE"
      route="/zone/infrastructure"
      position={position}
      color="#6366f1"
      statusText="Grid Balance: 99.8%"
      healthMetric="Storage: 94%"
      subStatus="Solar: 3.8 MW"
      onSelect={onSelect}
      tooltipOffset={[0, 4.8, 0]}
    >
      {/* 1. Infrastructure Hub Slab */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 7]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* 2. Battery Energy Storage System (BESS Banks) */}
      <group position={[-2.4, 0, 0]}>
        {[-1.2, 0, 1.2].map((zOffset, bIdx) => (
          <group key={`battery-${bIdx}`} position={[0, 0.8, zOffset]}>
            <mesh>
              <boxGeometry args={[1.4, 1.6, 0.9]} />
              <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Battery state-of-charge LED strip */}
            <mesh
              ref={bIdx === 1 ? batteryPulseRef : undefined}
              position={[0.72, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <planeGeometry args={[0.6, 1.2]} />
              <meshStandardMaterial
                color="#6366f1"
                emissive="#6366f1"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. High-Tech 5G Communication Mast & Sensor Spire */}
      <group position={[2.6, 0, 0]}>
        {/* Lattice / Column */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.12, 0.22, 4.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        {/* Telemetry Antenna Ring */}
        <mesh position={[0, 3.8, 0]}>
          <torusGeometry args={[0.5, 0.04, 8, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
        {/* Rotating Microwave Dish */}
        <group ref={radarDishRef} position={[0, 4.5, 0]}>
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 6, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.1, 0.2, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
          </mesh>
        </group>
        {/* CCTV Monitoring Pod */}
        <mesh position={[0.25, 2.8, 0.15]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.25, 2.8, 0.23]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* 4. Solar Canopy Arrays */}
      <group position={[0, 1.8, -2]}>
        <mesh rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[3.2, 0.06, 1.6]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.9}
            roughness={0.1}
            emissive="#0369a1"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Stands */}
        <mesh position={[-1.2, -0.9, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[1.2, -0.9, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* 5. EV Rapid Charging Stalls */}
      <group position={[0, 0, 2.2]}>
        {[-1.0, 1.0].map((stallX, sIdx) => (
          <group key={`ev-stall-${sIdx}`} position={[stallX, 0, 0]}>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.3, 1.2, 0.3]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.8, 0.16]}>
              <planeGeometry args={[0.2, 0.35]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </InteractiveZone>
  );
};
