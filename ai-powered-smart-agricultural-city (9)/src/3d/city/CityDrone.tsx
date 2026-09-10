import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CityDroneProps {
  centerPosition?: [number, number, number];
  flightRadius?: number;
  flightHeight?: number;
  speed?: number;
  type?: 'agri' | 'surveillance';
  scanColor?: string;
}

export const CityDrone: React.FC<CityDroneProps> = ({
  centerPosition = [-14, 4.5, -14],
  flightRadius = 5.5,
  flightHeight = 3.5,
  speed = 1.0,
  type = 'agri',
  scanColor = '#10b981',
}) => {
  const droneGroupRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Mesh[]>([]);
  const scanBeamRef = useRef<THREE.Mesh>(null);

  const [cx, cy, cz] = centerPosition;

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime() * speed;

    if (droneGroupRef.current) {
      if (type === 'agri') {
        // Lawnmower / figure-8 inspection pattern over agriculture
        const x = cx + Math.sin(t) * flightRadius;
        const z = cz + Math.sin(t * 2) * (flightRadius * 0.6);
        const y = cy + Math.sin(t * 3) * 0.35;

        // Calculate banking
        const dx = Math.cos(t) * flightRadius;
        const dz = Math.cos(t * 2) * 2 * (flightRadius * 0.6);
        const heading = Math.atan2(dx, dz);

        droneGroupRef.current.position.set(x, y, z);
        droneGroupRef.current.rotation.y = heading;
        droneGroupRef.current.rotation.z = Math.sin(t) * -0.15; // banking roll
        droneGroupRef.current.rotation.x = 0.08; // pitch forward
      } else {
        // High altitude surveillance orbit
        const x = cx + Math.cos(t * 0.8) * flightRadius;
        const z = cz + Math.sin(t * 0.8) * flightRadius;
        const y = cy + Math.sin(t * 1.5) * 0.4;
        droneGroupRef.current.position.set(x, y, z);
        droneGroupRef.current.rotation.y = -t * 0.8 + Math.PI;
      }
    }

    // Spin 4 rotors rapidly
    rotorsRef.current.forEach((rotor) => {
      if (rotor) rotor.rotation.y += delta * 35;
    });

    // Subtle scan beam pulse
    if (scanBeamRef.current) {
      scanBeamRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <group ref={droneGroupRef} position={centerPosition}>
      {/* Central Aerodynamic Chassis */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.16, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Top GPS / AI Sensor Dome */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 12]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 4 Carbon Fiber Rotor Arms */}
      {[
        [-0.32, 0.04, -0.32],
        [0.32, 0.04, -0.32],
        [-0.32, 0.04, 0.32],
        [0.32, 0.04, 0.32],
      ].map(([ax, ay, az], i) => (
        <group key={i} position={[ax, ay, az]}>
          {/* Arm strut */}
          <mesh position={[-ax * 0.4, 0, -az * 0.4]} rotation={[0, Math.atan2(az, ax), 0]}>
            <boxGeometry args={[0.35, 0.04, 0.05]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Motor Pod */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* 2-blade Propeller */}
          <mesh
            ref={(el) => {
              if (el) rotorsRef.current[i] = el;
            }}
            position={[0, 0.07, 0]}
          >
            <boxGeometry args={[0.55, 0.015, 0.05]} />
            <meshStandardMaterial
              color="#0284c7"
              transparent
              opacity={0.65}
              metalness={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Agri Spray Nozzles / Multispectral Sensor Pod */}
      {type === 'agri' && (
        <group position={[0, -0.15, 0]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.18, 10]} />
            <meshStandardMaterial color="#10b981" metalness={0.8} />
          </mesh>
          {/* Spray Booms */}
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.9, 0.03, 0.05]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Downward Multispectral LiDAR / Crop Scanner Cone */}
          <mesh ref={scanBeamRef} position={[0, -1.2, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 1.2, 2.2, 16, 1, true]} />
            <meshBasicMaterial
              color={scanColor}
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              wireframe={false}
            />
          </mesh>
          {/* Downward focused spotlight point */}
          <pointLight position={[0, -0.2, 0]} color={scanColor} intensity={2.5} distance={4.5} />
        </group>
      )}

      {/* Blinking Flight Status Navigation Beacon */}
      <mesh position={[0, 0.08, 0.26]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.08, -0.26]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
