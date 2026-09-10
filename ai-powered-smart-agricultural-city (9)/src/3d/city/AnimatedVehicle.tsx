import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface VehicleProps {
  type: 'car' | 'bus' | 'truck' | 'emergency';
  lane: 'north' | 'south' | 'east' | 'west';
  offset?: number; // lane offset
  speed?: number;
  initialProgress?: number;
  color?: string;
}

export const AnimatedVehicle: React.FC<VehicleProps> = ({
  type = 'car',
  lane,
  offset = 1.2,
  speed = 4,
  initialProgress = 0,
  color,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const progressRef = useRef(initialProgress);
  const roadLimit = 26;
  const roadSpan = roadLimit * 2;

  // Colors per type
  const vehicleColor = color || (
    type === 'bus' ? '#0ea5e9' :
    type === 'truck' ? '#10b981' :
    type === 'emergency' ? '#ef4444' :
    '#f8fafc'
  );

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + (speed * delta) / roadSpan) % 1;
    const p = progressRef.current;
    const currentCoord = -roadLimit + p * roadSpan;

    if (groupRef.current) {
      if (lane === 'north') {
        // Traveling South to North (z goes positive to negative or vice versa)
        groupRef.current.position.set(offset, 0, currentCoord);
        groupRef.current.rotation.set(0, 0, 0);
      } else if (lane === 'south') {
        groupRef.current.position.set(-offset, 0, -currentCoord);
        groupRef.current.rotation.set(0, Math.PI, 0);
      } else if (lane === 'east') {
        groupRef.current.position.set(currentCoord, 0, offset);
        groupRef.current.rotation.set(0, -Math.PI / 2, 0);
      } else if (lane === 'west') {
        groupRef.current.position.set(-currentCoord, 0, -offset);
        groupRef.current.rotation.set(0, Math.PI / 2, 0);
      }
    }

    // Spin wheels
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x += delta * speed * 2.5;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. CAR */}
      {type === 'car' && (
        <group position={[0, 0.2, 0]}>
          {/* Chassis */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.9, 0.35, 1.8]} />
            <meshStandardMaterial color={vehicleColor} roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Cabin */}
          <mesh position={[0, 0.42, -0.1]} castShadow>
            <boxGeometry args={[0.78, 0.3, 0.95]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Windshield */}
          <mesh position={[0, 0.42, 0.38]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[0.74, 0.28]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
          {/* Headlights */}
          <mesh position={[-0.32, 0.15, 0.91]}>
            <boxGeometry args={[0.15, 0.08, 0.04]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.32, 0.15, 0.91]}>
            <boxGeometry args={[0.15, 0.08, 0.04]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          {/* Taillights */}
          <mesh position={[-0.32, 0.15, -0.91]}>
            <boxGeometry args={[0.15, 0.08, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.32, 0.15, -0.91]}>
            <boxGeometry args={[0.15, 0.08, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
          {/* Wheels */}
          {[
            [-0.46, 0, 0.55],
            [0.46, 0, 0.55],
            [-0.46, 0, -0.55],
            [0.46, 0, -0.55],
          ].map(([wx, wy, wz], i) => (
            <group
              key={i}
              position={[wx, wy, wz]}
              ref={(el) => {
                if (el) wheelsRef.current[i] = el;
              }}
            >
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.14, 0.14, 0.1, 12]} />
                <meshStandardMaterial color="#1e293b" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 2. AUTONOMOUS ELECTRIC BUS */}
      {type === 'bus' && (
        <group position={[0, 0.28, 0]}>
          {/* Body */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.2, 0.85, 3.8]} />
            <meshStandardMaterial color={vehicleColor} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Panorama Glass Ribbon */}
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[1.22, 0.42, 3.4]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.3} roughness={0.1} />
          </mesh>
          {/* Rooftop Solar HVAC Strip */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.9, 0.08, 3.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Route Display LED */}
          <mesh position={[0, 0.78, 1.91]}>
            <boxGeometry args={[0.8, 0.12, 0.02]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} />
          </mesh>
          {/* Headlights */}
          <mesh position={[-0.45, 0.25, 1.91]}>
            <boxGeometry args={[0.2, 0.1, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.45, 0.25, 1.91]}>
            <boxGeometry args={[0.2, 0.1, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          {/* Wheels (6 Wheels) */}
          {[
            [-0.62, -0.05, 1.3],
            [0.62, -0.05, 1.3],
            [-0.62, -0.05, -0.4],
            [0.62, -0.05, -0.4],
            [-0.62, -0.05, -1.3],
            [0.62, -0.05, -1.3],
          ].map(([wx, wy, wz], i) => (
            <group
              key={i}
              position={[wx, wy, wz]}
              ref={(el) => {
                if (el) wheelsRef.current[i] = el;
              }}
            >
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 3. TRUCK (Logistics / Agri-produce transport) */}
      {type === 'truck' && (
        <group position={[0, 0.3, 0]}>
          {/* Cab */}
          <mesh position={[0, 0.5, 1.1]} castShadow>
            <boxGeometry args={[1.15, 0.9, 1.1]} />
            <meshStandardMaterial color={vehicleColor} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Windshield */}
          <mesh position={[0, 0.65, 1.66]}>
            <planeGeometry args={[0.95, 0.4]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
          {/* Cargo Container (Aeroponic Fresh Transport) */}
          <mesh position={[0, 0.65, -0.65]} castShadow>
            <boxGeometry args={[1.25, 1.15, 2.6]} />
            <meshStandardMaterial color="#065f46" roughness={0.4} />
          </mesh>
          {/* Container Green Eco Badge */}
          <mesh position={[0.63, 0.65, -0.65]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.6, 0.5]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} />
          </mesh>
          {/* Headlights */}
          <mesh position={[-0.45, 0.25, 1.66]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.45, 0.25, 1.66]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          {/* Wheels */}
          {[
            [-0.6, -0.05, 1.1],
            [0.6, -0.05, 1.1],
            [-0.6, -0.05, -0.6],
            [0.6, -0.05, -0.6],
            [-0.6, -0.05, -1.4],
            [0.6, -0.05, -1.4],
          ].map(([wx, wy, wz], i) => (
            <group
              key={i}
              position={[wx, wy, wz]}
              ref={(el) => {
                if (el) wheelsRef.current[i] = el;
              }}
            >
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.14, 12]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 4. EMERGENCY VEHICLE (Rapid Medical / Biosphere Response) */}
      {type === 'emergency' && (
        <group position={[0, 0.24, 0]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.0, 0.6, 2.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Red Emergency Stripe */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.02, 0.18, 2.32]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* Siren lightbar on roof */}
          <group position={[0, 0.7, 0.2]}>
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.18, 0.08, 0.12]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2.5} />
            </mesh>
            <mesh position={[0.2, 0, 0]}>
              <boxGeometry args={[0.18, 0.08, 0.12]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
            </mesh>
            <pointLight position={[0, 0.1, 0]} color="#ef4444" intensity={2} distance={3} />
          </group>
          {/* Headlights */}
          <mesh position={[-0.35, 0.22, 1.16]}>
            <boxGeometry args={[0.16, 0.08, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
          </mesh>
          <mesh position={[0.35, 0.22, 1.16]}>
            <boxGeometry args={[0.16, 0.08, 0.02]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
          </mesh>
          {/* Wheels */}
          {[
            [-0.52, 0, 0.7],
            [0.52, 0, 0.7],
            [-0.52, 0, -0.7],
            [0.52, 0, -0.7],
          ].map(([wx, wy, wz], i) => (
            <group
              key={i}
              position={[wx, wy, wz]}
              ref={(el) => {
                if (el) wheelsRef.current[i] = el;
              }}
            >
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
