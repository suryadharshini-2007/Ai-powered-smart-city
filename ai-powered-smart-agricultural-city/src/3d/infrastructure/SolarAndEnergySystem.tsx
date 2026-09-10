import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sun, BatteryCharging, Zap, ArrowDownUp, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SolarData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface SolarAndEnergySystemProps {
  solarData: SolarData;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SolarAndEnergySystem: React.FC<SolarAndEnergySystemProps> = ({
  solarData,
  onSelectNode,
  isNight = false,
}) => {
  const pulseRingsRef = useRef<THREE.Group>(null);
  const flowConduitRef = useRef<THREE.Mesh>(null);
  const solarTreeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse rings along energy conduits
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, idx) => {
        const offset = (t * 1.5 + idx * 0.4) % 1;
        child.position.x = THREE.MathUtils.lerp(-4.0, 4.0, offset);
        child.scale.setScalar(0.8 + Math.sin(offset * Math.PI) * 0.4);
      });
    }

    // Gentle solar tree sun-tracking rotation
    if (solarTreeRef.current) {
      solarTreeRef.current.rotation.y = Math.sin(t * 0.1) * 0.3;
    }
  });

  return (
    <group position={[-10.5, 0, -8.5]}>
      {/* ========================================================= */}
      {/* 1. PHOTOVOLTAIC BIFACIAL SOLAR CANOPY ARRAY */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          infraSounds.playEnergyPulse();
          onSelectNode({
            id: 'infra-solar-canopy',
            name: 'Bifacial High-Yield Photovoltaic Solar Smart Canopy',
            category: 'Solar & Renewable Generation',
            status: 'optimal',
            efficiency: solarData.panelEfficiencyPercent,
            powerKw: solarData.solarGenerationKw,
            description:
              'Perovskite-silicon tandem bifacial solar array with automated nano-coating dust repel. Absorbs direct sunlight from above and albedo reflected light from smart kinetic pavement below.',
            telemetryFields: [
              { label: 'Solar Generation', value: `${solarData.solarGenerationKw} kW` },
              { label: 'Energy Consumption', value: `${solarData.energyConsumptionKw} kW` },
              { label: 'Battery Storage', value: `${solarData.batteryPercent}% (${solarData.batteryCapacityKwh} kWh)` },
              { label: 'Grid Usage', value: `${solarData.gridUsageKw} kW (Net Exporter)` },
              { label: 'Inverter Efficiency', value: '99.1% High-Frequency SiC' },
              { label: 'Panel Surface Temp', value: '38.4 °C (Liquid-Cooled)' },
            ],
          });
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Support Steel Columns */}
        {[
          [-2.2, 1.8, -1.8],
          [-2.2, 1.8, 1.8],
          [2.2, 1.8, -1.8],
          [2.2, 1.8, 1.8],
        ].map(([cx, cy, cz], cIdx) => (
          <mesh key={`solar-col-${cIdx}`} position={[cx, cy, cz]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 3.6, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))}

        {/* Tilted Solar Panel Canopy Surface (Angle ~ 22 deg) */}
        <group position={[0, 3.8, 0]} rotation={[0.3, 0, 0]}>
          {/* Panel Framing Frame */}
          <mesh castShadow>
            <boxGeometry args={[5.8, 0.1, 4.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Glowing Photovoltaic Glass Tiles */}
          <mesh position={[0, 0.06, 0]}>
            <planeGeometry args={[5.6, 4.2]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={isNight ? 0.3 : 1.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Photovoltaic Busbar Grid Lines */}
          {[-2.0, -1.0, 0, 1.0, 2.0].map((lx, lIdx) => (
            <mesh key={`busbar-${lIdx}`} position={[lx, 0.07, 0]}>
              <boxGeometry args={[0.02, 0.01, 4.1]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          ))}
        </group>

        {/* Floating Solar Tag */}
        <Html position={[0, 5.2, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-amber-950/90 border border-amber-400 px-3 py-1 rounded-xl text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1.5 shadow-2xl whitespace-nowrap">
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            SOLAR PHOTOVOLTAIC CANOPY ({solarData.solarGenerationKw} kW)
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 2. BATTERY ENERGY STORAGE SYSTEM (BESS) CONTAINER */}
      {/* ========================================================= */}
      <group
        position={[4.5, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          infraSounds.playEnergyPulse();
          onSelectNode({
            id: 'infra-bess-container',
            name: 'Modular Liquid-Cooled BESS Utility Battery Array',
            category: 'Energy Storage & Microgrid',
            status: 'optimal',
            efficiency: 98.6,
            powerKw: solarData.energyConsumptionKw,
            description:
              'Advanced Lithium Iron Phosphate (LFP) energy storage vault. Provides microgrid frequency regulation, peak-shaving, and black-start capability for critical municipal infrastructure.',
            telemetryFields: [
              { label: 'State of Charge (SoC)', value: `${solarData.batteryPercent}%` },
              { label: 'Installed Capacity', value: `${solarData.batteryCapacityKwh} kWh` },
              { label: 'Battery Thermal Runaway', value: 'Nominal (Zero Anomaly)' },
              { label: 'Power Flow', value: 'Charging from Solar & Piezo Road' },
              { label: 'Grid Export Rate', value: `${Math.abs(solarData.gridUsageKw)} kW Outflow` },
            ],
          });
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Concrete Foundation Pad */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.2, 2.4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Heavy Insulated Container Body */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[2.8, 2.4, 2.0]} />
          <meshStandardMaterial
            color={isNight ? '#0b1120' : '#1e293b'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Teal Accent Trim Strip */}
        <mesh position={[0, 1.4, 1.01]}>
          <boxGeometry args={[2.6, 0.15, 0.02]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} />
        </mesh>

        {/* Battery State-of-Charge LED Level Bar */}
        <group position={[0, 1.8, 1.02]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.8, 0.25]} />
            <meshStandardMaterial color="#022c22" />
          </mesh>
          <mesh position={[-0.8 + (1.6 * (solarData.batteryPercent / 100)) / 2, 0, 0.01]}>
            <planeGeometry args={[1.6 * (solarData.batteryPercent / 100), 0.18]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* HVAC Chiller Unit on Roof */}
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[1.4, 0.35, 1.2]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>

        {/* Floating BESS Label */}
        <Html position={[0, 3.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-emerald-950/90 border border-emerald-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-emerald-300 font-bold flex items-center gap-1.5 shadow-xl">
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
            BESS STORAGE ({solarData.batteryPercent}%)
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 3. ANIMATED ENERGY FLOW CONDUIT (SOLAR → BESS) */}
      {/* ========================================================= */}
      <group position={[0, 0.15, 0]}>
        {/* Ground Conduit Pipe */}
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 5.0, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Pulsing Energy Nodes flowing across pipe */}
        <group ref={pulseRingsRef} position={[1.5, 0, 0]}>
          {[-1.5, -0.5, 0.5, 1.5].map((px, pIdx) => (
            <mesh key={`pulse-ring-${pIdx}`} position={[px, 0, 0]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
