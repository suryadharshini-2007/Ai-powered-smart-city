import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Cpu, ShieldCheck, Wifi, BatteryCharging } from 'lucide-react';

interface FarmerDashboardStationProps {
  position: [number, number, number];
  isSelected?: boolean;
  onClick: () => void;
  isDroneDocked?: boolean;
}

export const FarmerDashboardStation: React.FC<FarmerDashboardStationProps> = ({
  position,
  isSelected = false,
  onClick,
  isDroneDocked = false,
}) => {
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
      {/* 1. Concrete Platform Base */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.2, 3.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* 2. IoT Field Command Cabin */}
      <group position={[-0.8, 0.2, 0]}>
        {/* Main Building Frame */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[2.2, 2.3, 2.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Panoramic Observation Glass Window */}
        <mesh position={[1.11, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.0, 1.4]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.45}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Interior Command Screen Glow */}
        <mesh position={[0.6, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 0.8]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={1.4}
          />
        </mesh>

        {/* Solar Roof Canopy */}
        <group position={[0, 2.45, 0]} rotation={[0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 0.1, 2.9]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.3, 2.7]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.3}
              metalness={0.8}
            />
          </mesh>
        </group>

        {/* Telemetry Antenna Mast */}
        <mesh position={[-0.8, 3.1, -0.9]}>
          <cylinderGeometry args={[0.02, 0.03, 1.5, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[-0.8, 3.85, -0.9]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* 3. Drone Charging & Landing Pad */}
      <group position={[1.3, 0.22, 0]}>
        {/* Octagonal Base Pad */}
        <mesh receiveShadow>
          <cylinderGeometry args={[1.1, 1.2, 0.1, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* High-Tech Landing Cross & Ring */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.95, 24]} />
          <meshBasicMaterial
            color={isDroneDocked ? '#f59e0b' : '#38bdf8'}
          />
        </mesh>
        {/* 'H' / Drone Target Mark */}
        <mesh position={[-0.3, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.7]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.3, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.7]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.1]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Induction Wireless Charging Coils */}
        <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.55, 16]} />
          <meshBasicMaterial
            color={isDroneDocked ? '#f59e0b' : '#10b981'}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* Selection Halo */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.0, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isSelected ? 0.9 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Label */}
      <Html position={[0, 3.6, 0]} center distanceFactor={22}>
        <div
          className={`px-3.5 py-1.5 rounded-xl border backdrop-blur-xl text-center select-none shadow-xl cursor-pointer ${
            isSelected
              ? 'bg-sky-950/95 border-sky-400 text-white scale-105 shadow-sky-500/30'
              : 'bg-slate-950/85 border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-heading font-bold text-sky-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI FIELD MONITORING STATION</span>
          </div>
          <div className="text-[9px] font-mono text-slate-300 flex items-center justify-center gap-2 mt-0.5">
            <span className="text-emerald-400">AGRI-IOT CORE</span>
            <span>&bull;</span>
            <span className="text-slate-300">DRONE DOCK 01</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
