import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveZone } from './InteractiveZone';

interface WasteZoneProps {
  position?: [number, number, number];
  onSelect?: () => void;
}

export const WasteZone: React.FC<WasteZoneProps> = ({
  position = [-14, 0, 14],
  onSelect,
}) => {
  const compactorLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    // Blinking yellow beacon on the waste truck
    if (compactorLightRef.current) {
      compactorLightRef.current.intensity = (Math.sin(clock.getElapsedTime() * 6) + 1) * 1.5;
    }
  });

  return (
    <InteractiveZone
      id="waste"
      name="WASTE MANAGEMENT"
      route="/zone/waste"
      position={position}
      color="#14b8a6"
      statusText="Diverted: 96.8%"
      healthMetric="Bio-Digester: Active"
      subStatus="Biogas: 480 m³/h"
      onSelect={onSelect}
      tooltipOffset={[0, 4.8, 0]}
    >
      {/* 1. Facility Foundation Slab */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#111c1e" roughness={0.7} />
      </mesh>

      {/* 2. Anaerobic Digester Silos (Converting organic waste to energy) */}
      <group position={[-2.2, 0, -2]}>
        {/* Large Silo 1 */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 3.2, 16]} />
          <meshStandardMaterial color="#0f766e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.25, 0]}>
          <sphereGeometry args={[1.3, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.7} />
        </mesh>

        {/* Medium Silo 2 */}
        <mesh position={[2.4, 1.3, 0.5]}>
          <cylinderGeometry args={[1.0, 1.0, 2.6, 16]} />
          <meshStandardMaterial color="#0d9488" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.4, 2.65, 0.5]}>
          <sphereGeometry args={[1.0, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.7} />
        </mesh>

        {/* Interconnecting Biogas Pipeline */}
        <mesh position={[1.2, 2.5, 0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* 3. Waste Compaction & Sorting Building */}
      <group position={[2.6, 0, -1.8]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[3.6, 3.0, 3.8]} />
          <meshStandardMaterial color="#134e4a" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Loading Bay Roll-up Door */}
        <mesh position={[0, 1.0, 1.92]}>
          <planeGeometry args={[2.2, 2.0]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Smart Color-Coded Sensor Waste Bins */}
      <group position={[-2.8, 0, 2.8]}>
        {[
          { label: 'Organic', color: '#22c55e', x: -1.2 },
          { label: 'Recycle', color: '#0ea5e9', x: -0.4 },
          { label: 'Metals', color: '#f59e0b', x: 0.4 },
          { label: 'Hazard', color: '#ef4444', x: 1.2 },
        ].map((bin, idx) => (
          <group key={`bin-${idx}`} position={[bin.x, 0.45, 0]}>
            {/* Bin Body */}
            <mesh>
              <boxGeometry args={[0.55, 0.9, 0.5]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Colored Category Lid */}
            <mesh position={[0, 0.48, 0]}>
              <boxGeometry args={[0.58, 0.08, 0.52]} />
              <meshStandardMaterial color={bin.color} emissive={bin.color} emissiveIntensity={0.5} />
            </mesh>
            {/* Fill Level Sensor Indicator */}
            <mesh position={[0, 0.25, 0.26]}>
              <planeGeometry args={[0.3, 0.06]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Autonomous Waste Collection Truck */}
      <group position={[2.2, 0, 2.5]}>
        {/* Truck Chassis */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.3, 2.8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Compactor Container Tank */}
        <mesh position={[0, 0.95, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 2.0, 16]} />
          <meshStandardMaterial color="#0d9488" metalness={0.7} />
        </mesh>
        {/* Cab */}
        <mesh position={[0, 0.8, 1.0]}>
          <boxGeometry args={[1.15, 0.75, 0.8]} />
          <meshStandardMaterial color="#14b8a6" roughness={0.3} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.9, 1.42]}>
          <planeGeometry args={[0.9, 0.35]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        {/* Yellow Warning Flashing Beacon */}
        <mesh position={[0, 1.25, 0.9]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
        </mesh>
        <pointLight
          ref={compactorLightRef}
          position={[0, 1.4, 0.9]}
          color="#f59e0b"
          distance={3}
          intensity={1.5}
        />
        {/* Wheels */}
        {[
          [-0.65, 0.2, 0.9],
          [0.65, 0.2, 0.9],
          [-0.65, 0.2, -0.8],
          [0.65, 0.2, -0.8],
        ].map(([wx, wy, wz], i) => (
          <mesh key={i} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </InteractiveZone>
  );
};
