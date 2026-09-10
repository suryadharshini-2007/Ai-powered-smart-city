import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface DroneTelemetryData {
  id: string;
  status: 'ACTIVE' | 'SCANNING' | 'RETURNING' | 'CHARGING' | 'HOVERING';
  battery: number;
  altitude: number;
  speed: number;
  cropCoverage: number;
  plantsScanned: number;
  healthy: number;
  diseased: number;
  gps: string;
}

interface AgricultureDroneProps {
  position: [number, number, number];
  targetPosition?: [number, number, number];
  rotation?: [number, number, number];
  isScanning?: boolean;
  isSelected?: boolean;
  telemetry: DroneTelemetryData;
  onClick: () => void;
  onPositionUpdate?: (pos: THREE.Vector3) => void;
}

export const AgricultureDrone: React.FC<AgricultureDroneProps> = ({
  position,
  targetPosition,
  isScanning = false,
  isSelected = false,
  telemetry,
  onClick,
  onPositionUpdate,
}) => {
  const droneGroup = useRef<THREE.Group>(null);
  const rotorRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const scanConeRef = useRef<THREE.Mesh>(null);
  const sensorGlowRef = useRef<THREE.Mesh>(null);

  // Position interpolation vector
  const currentPos = useRef(new THREE.Vector3(...position));

  useFrame(({ clock }, delta) => {
    if (!droneGroup.current) return;

    // Fast rotor spin (slower if charging)
    const spinSpeed = telemetry.status === 'CHARGING' ? 1.5 : 45;
    rotorRefs.forEach((r, idx) => {
      if (r.current) {
        r.current.rotation.y += delta * spinSpeed * (idx % 2 === 0 ? 1 : -1);
      }
    });

    // Interpolate towards targetPosition if provided
    if (targetPosition) {
      const targetVec = new THREE.Vector3(...targetPosition);
      // Hovering bobbing
      const bob = telemetry.status === 'CHARGING' ? 0 : Math.sin(clock.getElapsedTime() * 3) * 0.12;
      targetVec.y += bob;

      currentPos.current.lerp(targetVec, delta * 2.2);
      droneGroup.current.position.copy(currentPos.current);

      // Tilt slightly in movement direction
      const diff = targetVec.clone().sub(currentPos.current);
      if (diff.length() > 0.1 && telemetry.status !== 'CHARGING') {
        const angle = Math.atan2(diff.x, diff.z);
        droneGroup.current.rotation.y = THREE.MathUtils.lerp(
          droneGroup.current.rotation.y,
          angle,
          delta * 3
        );
        droneGroup.current.rotation.z = THREE.MathUtils.lerp(
          droneGroup.current.rotation.z,
          -diff.x * 0.15,
          delta * 4
        );
      } else {
        droneGroup.current.rotation.z = THREE.MathUtils.lerp(
          droneGroup.current.rotation.z,
          0,
          delta * 2
        );
      }
    } else {
      // Gentle hovering bobbing
      const bob = telemetry.status === 'CHARGING' ? 0 : Math.sin(clock.getElapsedTime() * 2.5) * 0.15;
      droneGroup.current.position.y = position[1] + bob;
    }

    if (onPositionUpdate && droneGroup.current) {
      onPositionUpdate(droneGroup.current.position);
    }

    // Scanning cone animation
    if (scanConeRef.current && isScanning) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.08;
      scanConeRef.current.scale.set(scale, 1, scale);
    }

    // Sensor pulse
    if (sensorGlowRef.current) {
      const mat = sensorGlowRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isScanning
          ? 2.5 + Math.sin(clock.getElapsedTime() * 10) * 1.5
          : 0.8;
      }
    }
  });

  return (
    <group
      ref={droneGroup}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Central Aerodynamic Carbon-Fiber Fuselage */}
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.14, 0.55]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Top GPS / Avionics Dome */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.08, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 2. Four Diagonal Carbon-Fiber Arms */}
      {[
        { x: 0.45, z: 0.45, rot: Math.PI / 4, refIdx: 0, ledColor: '#22c55e' },
        { x: -0.45, z: 0.45, rot: -Math.PI / 4, refIdx: 1, ledColor: '#22c55e' },
        { x: 0.45, z: -0.45, rot: -Math.PI / 4, refIdx: 2, ledColor: '#ef4444' },
        { x: -0.45, z: -0.45, rot: Math.PI / 4, refIdx: 3, ledColor: '#ef4444' },
      ].map((arm, i) => (
        <group key={`arm-${i}`} position={[arm.x, 0, arm.z]}>
          {/* Arm Bar */}
          <mesh
            position={[-arm.x / 2, 0, -arm.z / 2]}
            rotation={[0, arm.rot, 0]}
          >
            <boxGeometry args={[0.7, 0.04, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Motor Pod */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>

          {/* Navigation LED under Motor */}
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={arm.ledColor} />
          </mesh>

          {/* Rotor Propeller Blades */}
          <mesh ref={rotorRefs[arm.refIdx]} position={[0, 0.13, 0]}>
            <boxGeometry args={[0.55, 0.008, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.75}
              metalness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* 3. Landing Gear Skids */}
      {[-0.2, 0.2].map((xOffset, idx) => (
        <group key={`skid-${idx}`} position={[xOffset, -0.16, 0]}>
          {/* Vertical struts */}
          <mesh position={[0, 0.07, -0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.07, 0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Horizontal Tube Skid */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 4. Gimbal-mounted Multispectral Sensor / Camera */}
      <group position={[0, -0.12, 0.08]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh ref={sensorGlowRef} position={[0, -0.06, 0.02]}>
          <cylinderGeometry args={[0.04, 0.05, 0.06, 12]} />
          <meshStandardMaterial
            color={isScanning ? '#06b6d4' : '#10b981'}
            emissive={isScanning ? '#06b6d4' : '#10b981'}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 5. Active Multispectral Scanning Beam (Volumetric Cone) */}
      {isScanning && (
        <mesh
          ref={scanConeRef}
          position={[0, -2.5, 0]}
          rotation={[Math.PI, 0, 0]}
        >
          <coneGeometry args={[2.8, 5.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 6. Target Selection Glow Ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.05, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isSelected ? 0.9 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 7. Floating Quick-Status Pill */}
      <Html position={[0, 0.6, 0]} center distanceFactor={18}>
        <div
          className={`px-3 py-1 rounded-xl backdrop-blur-xl border transition-all text-center select-none shadow-xl cursor-pointer ${
            isSelected
              ? 'bg-sky-950/95 border-sky-400 text-sky-200 scale-105 shadow-sky-500/40'
              : 'bg-slate-950/85 border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                isScanning
                  ? 'bg-cyan-400 animate-ping'
                  : telemetry.status === 'CHARGING'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span>{telemetry.id}</span>
            <span className="text-slate-400">|</span>
            <span
              className={
                telemetry.battery < 25
                  ? 'text-red-400'
                  : telemetry.battery < 50
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }
            >
              {telemetry.battery}%
            </span>
          </div>
          <div className="text-[8px] font-mono text-slate-400">
            {telemetry.status} &bull; {telemetry.altitude}m
          </div>
        </div>
      </Html>
    </group>
  );
};
