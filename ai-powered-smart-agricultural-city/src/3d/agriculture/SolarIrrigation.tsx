import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sun, Zap, Activity, Gauge } from 'lucide-react';

interface SolarIrrigationProps {
  position: [number, number, number];
  isIrrigating?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  solarOutputKw?: number;
  panelEfficiencyPercent?: number;
  pumpPowerKw?: number;
  energyUsedKwh?: number;
}

export const SolarIrrigation: React.FC<SolarIrrigationProps> = ({
  position,
  isIrrigating = true,
  isSelected = false,
  onClick,
  solarOutputKw = 4.8,
  panelEfficiencyPercent = 22.4,
  pumpPowerKw = 3.2,
  energyUsedKwh = 18.6,
}) => {
  const energyPulseRef1 = useRef<THREE.Mesh>(null);
  const energyPulseRef2 = useRef<THREE.Mesh>(null);
  const pumpImpellerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    // Pulse 1: Solar Panel to Controller
    if (energyPulseRef1.current) {
      const p = (clock.getElapsedTime() * 1.5) % 1;
      energyPulseRef1.current.position.set(-1.2 + p * 1.2, 0.4, 0);
    }
    // Pulse 2: Controller to Pump
    if (energyPulseRef2.current) {
      const p = (clock.getElapsedTime() * 1.5 + 0.5) % 1;
      energyPulseRef2.current.position.set(0, 0.4, -0.6 + p * 1.2);
    }
    // Spin pump motor shaft if irrigating
    if (pumpImpellerRef.current && isIrrigating) {
      pumpImpellerRef.current.rotation.x += delta * 15;
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
      {/* Concrete Foundation Pad */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.5, 4.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 1. Dual Solar Panel Racks */}
      {[-1.6, -0.2].map((rackX, rIdx) => (
        <group key={`rack-${rIdx}`} position={[rackX - 1.2, 0, -0.5]}>
          {/* Steel Support Posts */}
          <mesh position={[-0.9, 0.6, -0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0.9, 0.6, -0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[-0.9, 0.3, 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0.9, 0.3, 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>

          {/* Photovoltaic Panel Surface (Angled toward Sun) */}
          <group position={[0, 0.7, 0]} rotation={[-Math.PI / 6, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.2, 0.06, 1.4]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Silicon Cells with High-Efficiency Glow */}
            <mesh position={[0, 0.035, 0]}>
              <planeGeometry args={[2.1, 1.3]} />
              <meshStandardMaterial
                color="#0284c7"
                metalness={0.9}
                roughness={0.1}
                emissive="#0369a1"
                emissiveIntensity={0.35}
              />
            </mesh>
            {/* Grid Lines on PV Cells */}
            {[-0.6, 0, 0.6].map((gx, gIdx) => (
              <mesh key={`grid-x-${gIdx}`} position={[gx, 0.038, 0]}>
                <planeGeometry args={[0.01, 1.3]} />
                <meshBasicMaterial color="#e2e8f0" transparent opacity={0.4} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* 2. Smart Inverter & Charge Controller Cabinet */}
      <group position={[0.3, 0, -0.6]}>
        {/* Enclosure */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.65, 1.3, 0.45]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* LCD Status Screen */}
        <mesh position={[0, 0.95, 0.23]}>
          <planeGeometry args={[0.35, 0.22]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* LED Indicators */}
        <mesh position={[-0.12, 0.75, 0.23]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0.75, 0.23]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.12, 0.75, 0.23]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* 3. High-Efficiency Centrifugal Water Pump */}
      <group position={[0.3, 0, 0.8]}>
        {/* Motor Block */}
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
          <meshStandardMaterial color="#0f766e" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Centrifugal Volute Casing */}
        <mesh position={[0.42, 0.35, 0]}>
          <torusGeometry args={[0.22, 0.08, 12, 16]} />
          <meshStandardMaterial color="#0d9488" metalness={0.8} />
        </mesh>
        {/* Shaft / Impeller */}
        <mesh ref={pumpImpellerRef} position={[0.42, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.06]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
        {/* Pressure Gauge */}
        <group position={[0.42, 0.65, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <circleGeometry args={[0.065, 12]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* 4. Interconnecting Conduit Lines (Solar to Controller to Pump) */}
      {/* Line 1: Solar to Inverter */}
      <mesh position={[-0.6, 0.15, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      {/* Pulse 1 */}
      <mesh ref={energyPulseRef1} position={[-0.6, 0.2, -0.6]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Line 2: Inverter to Pump */}
      <mesh position={[0.3, 0.15, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      {/* Pulse 2 */}
      <mesh ref={energyPulseRef2} position={[0.3, 0.2, 0.1]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Line 3: Pump Outflow Pipe heading into irrigation grid */}
      <mesh position={[1.4, 0.2, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} />
      </mesh>

      {/* Selection Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 3.1, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isSelected ? 0.9 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Solar HUD */}
      <Html position={[0, 2.2, 0]} center distanceFactor={22}>
        <div
          className={`px-3 py-1.5 rounded-xl border backdrop-blur-xl text-center select-none shadow-xl cursor-pointer ${
            isSelected
              ? 'bg-sky-950/95 border-sky-400 text-white scale-105'
              : 'bg-slate-950/85 border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-heading font-bold text-sky-400">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>SOLAR IRRIGATION SYSTEM</span>
          </div>
          <div className="text-[9px] font-mono text-slate-300 mt-0.5 flex items-center gap-2">
            <span>Gen: {solarOutputKw} kW</span>
            <span>&bull;</span>
            <span>Pump: {pumpPowerKw} kW</span>
            <span>&bull;</span>
            <span className="text-emerald-400">{isIrrigating ? 'PUMPING' : 'STANDBY'}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
