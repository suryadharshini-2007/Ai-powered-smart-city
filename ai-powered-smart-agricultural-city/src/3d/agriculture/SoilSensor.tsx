import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SoilSensorProps {
  position: [number, number, number];
  sensorId: string;
  moisture: number;
  temperature?: number;
  isSelected?: boolean;
  onClick: () => void;
  targetDashboardPos?: [number, number, number];
}

export const SoilSensor: React.FC<SoilSensorProps> = ({
  position,
  sensorId,
  moisture,
  temperature = 24.5,
  isSelected = false,
  onClick,
  targetDashboardPos = [10, 2, -10],
}) => {
  const ledRef = useRef<THREE.Mesh>(null);
  const dataPulseRef = useRef<THREE.Mesh>(null);
  const pulseProgress = useRef(0);

  // Status computation
  const isOptimal = moisture >= 60 && moisture <= 75;
  const isLow = moisture < 60;
  const isHigh = moisture > 75;
  const statusColor = isOptimal ? '#10b981' : isLow ? '#f59e0b' : '#06b6d4';

  useFrame(({ clock }, delta) => {
    // Blinking LED transmission indicator
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 8) * 1.5;
      }
    }

    // Animated telemetry data packet traveling to AI dashboard
    if (dataPulseRef.current && isSelected) {
      pulseProgress.current = (pulseProgress.current + delta * 0.8) % 1;
      const p = pulseProgress.current;
      const [tx, ty, tz] = targetDashboardPos;
      const [sx, sy, sz] = position;

      dataPulseRef.current.position.set(
        sx + (tx - sx) * p,
        sy + 0.5 + Math.sin(p * Math.PI) * 3 + (ty - sy) * p,
        sz + (tz - sz) * p
      );
    }
  });

  return (
    <group
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
      {/* Probe Ground Stake (Inserted into soil) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.01, 0.35, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>

      {/* Main Sensor Housing Tube */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.4, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Weatherproof Sealing Ring */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>

      {/* Mini Solar Harvesting Cap */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.025, 12]} />
        <meshStandardMaterial
          color="#0284c7"
          metalness={0.9}
          roughness={0.1}
          emissive="#0369a1"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Wireless RF Antenna Spire */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.3, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>

      {/* Status LED */}
      <mesh ref={ledRef} position={[0.068, 0.52, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Selection Halo / Ground Sensor Detection Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.38, 20]} />
        <meshBasicMaterial
          color={statusColor}
          transparent
          opacity={isSelected ? 0.9 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Active Data Pulse Particle moving to Dashboard */}
      {isSelected && (
        <>
          <mesh ref={dataPulseRef}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Data transmission laser guide line */}
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) => {
                const points = [
                  new THREE.Vector3(0, 0.6, 0),
                  new THREE.Vector3(
                    targetDashboardPos[0] - position[0],
                    targetDashboardPos[1] - position[1] + 1,
                    targetDashboardPos[2] - position[2]
                  ),
                ];
                self.setFromPoints(points);
              }}
            />
            <lineBasicMaterial
              attach="material"
              color="#38bdf8"
              transparent
              opacity={0.35}
              linewidth={1}
            />
          </line>
        </>
      )}

      {/* Floating Sensor Tag */}
      <Html position={[0, 1.05, 0]} center distanceFactor={16}>
        <div
          className={`px-2 py-0.5 rounded-lg text-[9px] font-mono whitespace-nowrap backdrop-blur-md border transition-all select-none ${
            isSelected
              ? 'bg-sky-950/90 text-sky-300 border-sky-400/80 shadow-lg scale-110'
              : 'bg-slate-950/80 text-slate-300 border-slate-700/60'
          }`}
        >
          <span className="font-bold">{sensorId}</span>: {moisture}%
        </div>
      </Html>
    </group>
  );
};
