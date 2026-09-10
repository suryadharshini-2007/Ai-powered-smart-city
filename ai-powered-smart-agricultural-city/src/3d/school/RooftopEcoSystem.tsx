import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SolarTelemetry, RainwaterTelemetry } from './SchoolTypes';

interface RooftopEcoSystemProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const RooftopEcoSystem: React.FC<RooftopEcoSystemProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const [solarData] = useState<SolarTelemetry>({
    powerGeneratedKw: 42.0,
    currentEnergyKwh: 184.5,
    consumptionKw: 28.2,
    batteryStoragePercent: 86,
  });

  const [rainwaterData] = useState<RainwaterTelemetry>({
    harvestedTodayLitres: 4850,
    tankCapacityLitres: 35000,
    filtrationEfficiency: 99.4,
    currentFlowLpm: 32.0,
    destination: 'Green Campus Gardens & Restroom Cisterns',
  });

  // Animated energy flow pulses
  const energyPulseRef1 = useRef<THREE.Mesh>(null);
  const energyPulseRef2 = useRef<THREE.Mesh>(null);
  const waterPulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Solar pulse moving along wire from panels to inverter & battery
    if (energyPulseRef1.current) {
      const p = (t * 1.5) % 1;
      energyPulseRef1.current.position.x = -6 + p * 8;
    }
    if (energyPulseRef2.current) {
      const p = ((t * 1.5) + 0.5) % 1;
      energyPulseRef2.current.position.x = -6 + p * 8;
    }

    // 2. Rainwater pulse moving down pipe
    if (waterPulseRef.current) {
      const p = (t * 2.0) % 1;
      waterPulseRef.current.position.y = 8.5 - p * 7.5;
    }
  });

  const handleSelectSolar = () => {
    onSelectNode({
      id: 'rooftop-solar-array-01',
      name: 'High-Efficiency Bifacial Solar Photovoltaic Farm',
      category: 'Renewable Microgrid',
      status: 'optimal',
      efficiency: 98.4,
      powerKw: solarData.powerGeneratedKw,
      description:
        'Roof-mounted high-efficiency monocrystalline solar array feeding the campus microgrid and high-capacity lithium iron phosphate (LFP) energy storage system.',
      telemetryFields: [
        { label: 'Solar Power Generated', value: '42 kW', unit: 'kW' },
        { label: 'Current Energy', value: `${solarData.currentEnergyKwh} kWh`, unit: 'kWh' },
        { label: 'Energy Consumption', value: `${solarData.consumptionKw} kW`, unit: 'kW' },
        { label: 'Battery Storage', value: `${solarData.batteryStoragePercent}%`, unit: '%' },
        { label: 'Flow Path', value: 'PANELS → POWER SYSTEM → BATTERY → SCHOOL' },
      ],
    });
  };

  const handleSelectRainwater = () => {
    onSelectNode({
      id: 'rainwater-harvesting-system-01',
      name: 'Smart Rooftop Rainwater Harvesting & Filtration Plant',
      category: 'Circular Water Management',
      status: 'optimal',
      efficiency: rainwaterData.filtrationEfficiency,
      powerKw: 0.8,
      description:
        'Continuous roof runoff catchment system with automatic leaf-diverters, vortex sediment filters, and a 35,000L underground/aboveground reservoir for campus landscaping and smart restrooms.',
      telemetryFields: [
        { label: 'Harvested Today', value: `${rainwaterData.harvestedTodayLitres} Litres` },
        { label: 'Tank Storage Reserve', value: '28,000 / 35,000 L' },
        { label: 'Filtration Efficiency', value: `${rainwaterData.filtrationEfficiency}%` },
        { label: 'Flow Rate', value: `${rainwaterData.currentFlowLpm} L/min` },
        { label: 'Flow Sequence', value: 'ROOF → PIPE → FILTER → TANK → USE' },
      ],
    });
  };

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. ROOFTOP SOLAR PHOTOVOLTAIC PANELS (On main building roof, y ~ 8.4) */}
      {/* ========================================================= */}
      <group
        position={[-1, 8.45, -7]}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectSolar();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Array of 3 rows of 4 tilted solar panels */}
        {[-4.5, -1.5, 1.5, 4.5].map((x, colIdx) =>
          [-2, 0.5, 3].map((z, rowIdx) => (
            <group
              key={`solar-panel-${colIdx}-${rowIdx}`}
              position={[x, 0.4, z]}
              rotation={[-0.3, 0, 0]}
            >
              {/* Mounting Rack Leg */}
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.08, 0.4, 0.08]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} />
              </mesh>
              {/* Panel Frame */}
              <mesh castShadow>
                <boxGeometry args={[2.4, 0.06, 1.6]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Blue Photovoltaic Surface with Anti-Reflective Coating */}
              <mesh position={[0, 0.035, 0]}>
                <planeGeometry args={[2.3, 1.5]} />
                <meshStandardMaterial
                  color={isNight ? '#0c2340' : '#0284c7'}
                  emissive={isNight ? '#075985' : '#0284c7'}
                  emissiveIntensity={isNight ? 0.3 : 0.6}
                  metalness={0.8}
                  roughness={0.1}
                />
              </mesh>
              {/* PV Grid Lines */}
              <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.2, 1.4]} />
                <meshBasicMaterial color="#38bdf8" wireframe opacity={0.3} transparent />
              </mesh>
            </group>
          ))
        )}

        {/* Inverter & Microgrid Power Cabinet */}
        <group position={[6.5, 0.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.4, 1.0]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* LED Indicators */}
          <mesh position={[0, 0.3, 0.51]}>
            <planeGeometry args={[0.8, 0.2]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={2}
            />
          </mesh>
        </group>

        {/* Lithium Battery Storage Bank */}
        <group position={[8.2, 0.7, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 1.6, 1.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Battery Charge Gauge */}
          <mesh position={[0, 0.2, 0.61]}>
            <planeGeometry args={[1.2, 0.3]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={2}
            />
          </mesh>
        </group>

        {/* Conduit Line from Panels to Battery */}
        <mesh position={[1, 0.1, 0]}>
          <boxGeometry args={[12, 0.06, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Animated Energy Flow Pulses: SOLAR PANELS → POWER SYSTEM → BATTERY → SCHOOL */}
        <mesh ref={energyPulseRef1} position={[-6, 0.12, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={3}
          />
        </mesh>
        <mesh ref={energyPulseRef2} position={[-2, 0.12, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={3}
          />
        </mesh>

        {/* 3D Floating Telemetry HUD over Solar Panels */}
        <Html position={[0, 2.5, 0]} center distanceFactor={14} className="pointer-events-none select-none">
          <div className="bg-slate-950/95 border border-amber-500/70 p-2.5 rounded-xl shadow-2xl text-center w-[230px] backdrop-blur-md font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                SOLAR PHOTOVOLTAIC
              </span>
              <span className="text-[9px] bg-amber-950 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                42 kW PEAK
              </span>
            </div>
            <div className="text-[9px] text-slate-300 space-y-0.5 text-left mb-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Energy:</span>
                <span className="text-white font-bold">{solarData.currentEnergyKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consumption:</span>
                <span className="text-sky-300 font-bold">{solarData.consumptionKw} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Battery Reserve:</span>
                <span className="text-emerald-400 font-bold">{solarData.batteryStoragePercent}%</span>
              </div>
            </div>
            <div className="text-[8px] bg-slate-900 px-1 py-1 rounded text-amber-300 font-semibold border border-slate-800">
              SOLAR ➔ POWER SYSTEM ➔ BATTERY ➔ SCHOOL
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 2. RAINWATER HARVESTING & FILTRATION SYSTEM */}
      {/* ========================================================= */}
      <group
        position={[12.2, 0, -5]}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectRainwater();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Rooftop Catchment Gutter running along edge */}
        <mesh position={[-0.8, 8.4, -2]} castShadow>
          <boxGeometry args={[0.3, 0.25, 12]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>

        {/* Vertical Downspout Collection Pipe (Roof -> Ground Filter) */}
        <mesh position={[-0.8, 4.4, 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 8.0, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Animated Water Droplet Flowing Down Collection Pipe */}
        <mesh ref={waterPulseRef} position={[-0.8, 4.4, 2]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={3}
          />
        </mesh>

        {/* Sediment & Multi-Media Vortex Filtration Unit */}
        <group position={[-0.8, 1.2, 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 1.8, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Transparent Glass Filter Inspection Window */}
          <mesh position={[0, 0, 0.35]}>
            <boxGeometry args={[0.35, 0.9, 0.2]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>

        {/* Large Rainwater Storage Tank (35,000L capacity) */}
        <group position={[1.4, 1.8, 2]}>
          {/* Main Tank Body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.5, 3.4, 24]} />
            <meshStandardMaterial color="#0369a1" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Level Gauge Strip */}
          <mesh position={[0, 0, 1.52]}>
            <planeGeometry args={[0.3, 2.6]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2}
            />
          </mesh>
        </group>

        {/* Outlet Supply Pipe to School & Gardens */}
        <mesh position={[1.4, 0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 5.5, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} />
        </mesh>

        {/* 3D Floating Telemetry HUD over Rainwater Tank */}
        <Html position={[1.4, 4.2, 2]} center distanceFactor={12} className="pointer-events-none select-none">
          <div className="bg-slate-950/95 border border-sky-500/70 p-2.5 rounded-xl shadow-2xl text-center w-[230px] backdrop-blur-md font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                RAINWATER HARVESTING
              </span>
              <span className="text-[9px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-300 font-bold">
                RESERVE: 28k L
              </span>
            </div>
            <div className="text-[9px] text-slate-300 space-y-0.5 text-left mb-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Harvested Today:</span>
                <span className="text-white font-bold">{rainwaterData.harvestedTodayLitres} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Filter Efficiency:</span>
                <span className="text-emerald-400 font-bold">{rainwaterData.filtrationEfficiency}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flow Rate:</span>
                <span className="text-sky-300 font-bold">{rainwaterData.currentFlowLpm} L/min</span>
              </div>
            </div>
            <div className="text-[8px] bg-slate-900 px-1 py-1 rounded text-sky-300 font-semibold border border-slate-800">
              ROOF ➔ PIPE ➔ FILTER ➔ TANK ➔ SCHOOL
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
