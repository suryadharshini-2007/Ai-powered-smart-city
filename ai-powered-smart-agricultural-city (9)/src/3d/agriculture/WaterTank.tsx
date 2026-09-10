import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface WaterTankProps {
  position: [number, number, number];
  waterLevelPercent?: number;
  isSelected?: boolean;
  onClick: () => void;
}

export const WaterTank: React.FC<WaterTankProps> = ({
  position,
  waterLevelPercent = 86,
  isSelected = false,
  onClick,
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
      {/* 1. Structural Steel Lattice Legs */}
      {[
        [-1.1, -1.1],
        [1.1, -1.1],
        [-1.1, 1.1],
        [1.1, 1.1],
      ].map(([lx, lz], i) => (
        <group key={`leg-${i}`} position={[lx, 1.5, lz]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.09, 3.0, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          {/* Concrete Footing */}
          <mesh position={[0, -1.45, 0]}>
            <boxGeometry args={[0.35, 0.15, 0.35]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* Cross Bracing Struts */}
      <mesh position={[0, 1.5, -1.1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.8, 0.04, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 1.5, 1.1]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[2.8, 0.04, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Tank Elevated Platform */}
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.18, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* 2. Main Cylindrical Water Storage Tank */}
      <mesh position={[0, 4.6, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 3.0, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Tank Dome Cap */}
      <mesh position={[0, 6.1, 0]}>
        <sphereGeometry args={[1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        <meshStandardMaterial
          color="#0369a1"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 3. Water Level Gauge Glass Tube */}
      <group position={[0, 4.6, 1.62]}>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[0.22, 2.6, 0.06]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Fill Gauge Strip */}
        <mesh position={[0, (waterLevelPercent / 100 - 0.5) * 1.2, 0.04]}>
          <planeGeometry args={[0.12, (waterLevelPercent / 100) * 2.4]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      {/* 4. Inspection Ladder */}
      <group position={[-1.62, 3.0, 0]}>
        <mesh position={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 6.0, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 6.0, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {Array.from({ length: 12 }).map((_, r) => (
          <mesh key={`rung-${r}`} position={[0, -2.8 + r * 0.5, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
        ))}
      </group>

      {/* 5. Main Outflow Valve & Pipe entering Ground */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 3.0, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Pressure Valve Handwheel */}
        <mesh position={[0, 0.4, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.03, 8, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Selection Glow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.3, 32]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={isSelected ? 0.9 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating HUD Tag */}
      <Html position={[0, 6.8, 0]} center distanceFactor={22}>
        <div
          className={`px-3 py-1 rounded-xl border backdrop-blur-xl text-center select-none shadow-xl ${
            isSelected
              ? 'bg-sky-950/95 border-sky-400 text-white scale-105'
              : 'bg-slate-950/80 border-slate-700 text-slate-300'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-sky-400">
            BUFFER WATER RESERVOIR
          </div>
          <div className="text-[9px] font-mono text-slate-200">
            Storage: {waterLevelPercent}% (42,000 L)
          </div>
        </div>
      </Html>
    </group>
  );
};
