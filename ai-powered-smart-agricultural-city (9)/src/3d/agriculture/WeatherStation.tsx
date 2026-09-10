import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Thermometer, Droplets, Wind, Sun, CloudRain } from 'lucide-react';

interface WeatherStationProps {
  position: [number, number, number];
  isSelected?: boolean;
  onClick: () => void;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  solarRadiation?: number;
  rainfall?: number;
}

export const WeatherStation: React.FC<WeatherStationProps> = ({
  position,
  isSelected = false,
  onClick,
  temperature = 29,
  humidity = 72,
  windSpeed = 8.4,
  solarRadiation = 840,
  rainfall = 0.0,
}) => {
  const anemometerRef = useRef<THREE.Group>(null);
  const windVaneRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Spin anemometer based on wind speed
    if (anemometerRef.current) {
      anemometerRef.current.rotation.y += delta * (windSpeed * 0.45);
    }
    // Wind vane gentle drift
    if (windVaneRef.current) {
      windVaneRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.4 + 0.8;
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
      {/* 1. Tripod Steel Foundation */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, i) => (
        <group key={`leg-${i}`} rotation={[0, rad, 0]}>
          <mesh position={[0.45, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[0.8, 0.02, 0]}>
            <boxGeometry args={[0.15, 0.04, 0.15]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* 2. Central Mast Pole */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>

      {/* 3. Multi-plate Radiation Shield (Temperature & Humidity Sensor) */}
      <group position={[0, 2.2, 0]}>
        {[0, 0.08, 0.16, 0.24, 0.32].map((y, idx) => (
          <mesh key={`plate-${idx}`} position={[0, y, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.03, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 4. Rain Gauge Tipping Funnel */}
      <group position={[0.45, 2.9, 0]}>
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.08, 0.25, 12]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 12, 1, true]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 5. Solar Radiation Pyranometer */}
      <group position={[-0.45, 3.1, 0]}>
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.06, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 6. Anemometer (3-cup Wind Speed Sensor) */}
      <group ref={anemometerRef} position={[0, 4.4, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <group key={`cup-${i}`} rotation={[0, angle, 0]}>
            <mesh position={[0.22, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.012, 0.012, 0.44, 6]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0.44, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <sphereGeometry args={[0.07, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Wind Vane Pointer */}
      <group ref={windVaneRef} position={[0, 4.0, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Pointer Arrow */}
        <mesh position={[0.2, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Arrowhead */}
        <mesh position={[0.42, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.05, 0.12, 6]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Tail fin */}
        <mesh position={[-0.2, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.16, 0.01]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* 8. IoT Weather Transmitter Box */}
      <mesh position={[0, 1.4, 0.16]}>
        <boxGeometry args={[0.3, 0.4, 0.16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.4, 0.25]}>
        <planeGeometry args={[0.2, 0.25]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>

      {/* Selection Glow Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.3, 24]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isSelected ? 0.9 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D HUD Badge */}
      <Html position={[0, 4.8, 0]} center distanceFactor={20}>
        <div
          className={`px-3 py-1.5 rounded-xl border backdrop-blur-xl transition-all cursor-pointer select-none whitespace-nowrap shadow-xl flex items-center gap-2.5 ${
            isSelected
              ? 'bg-sky-950/95 border-sky-400 text-white scale-105 shadow-sky-500/30'
              : 'bg-slate-950/85 border-slate-700/80 text-slate-300 hover:border-sky-400/60'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <div className="text-left font-mono">
            <div className="text-[10px] font-bold text-sky-300 font-heading">
              METEOROLOGICAL STATION
            </div>
            <div className="text-[9px] text-slate-300 flex items-center gap-2">
              <span>{temperature}°C</span>
              <span>&bull;</span>
              <span>{humidity}% RH</span>
              <span>&bull;</span>
              <span>{windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
