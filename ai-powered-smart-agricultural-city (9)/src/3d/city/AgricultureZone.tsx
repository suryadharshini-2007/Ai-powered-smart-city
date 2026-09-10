import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveZone } from './InteractiveZone';
import { CityDrone } from './CityDrone';

interface AgricultureZoneProps {
  position?: [number, number, number];
  onSelect?: () => void;
  droneActive?: boolean;
}

export const AgricultureZone: React.FC<AgricultureZoneProps> = ({
  position = [-14, 0, -14],
  onSelect,
  droneActive = true,
}) => {
  const waterFlowRef = useRef<THREE.Mesh>(null);
  const anemometerRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    // Water pulse along irrigation pipes
    if (waterFlowRef.current) {
      waterFlowRef.current.position.x = -1.5 + Math.sin(clock.getElapsedTime() * 3) * 1.5;
    }
    // Spinning anemometer on weather sensor
    if (anemometerRef.current) {
      anemometerRef.current.rotation.y += delta * 4;
    }
  });

  return (
    <InteractiveZone
      id="agriculture"
      name="AGRICULTURAL LAND"
      route="/zone/agriculture"
      position={position}
      color="#22c55e"
      statusText="Crop Health: 87%"
      healthMetric="Status: Healthy"
      subStatus="Moisture 64%"
      onSelect={onSelect}
      tooltipOffset={[0, 4.8, 0]}
    >
      {/* 1. Agricultural Soil Field Plot Base */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.9} />
      </mesh>

      {/* 2. Crop Field Rows (Raised planting beds with lush crops) */}
      {[-3.6, -1.8, 0, 1.8, 3.6].map((zRow, rIdx) => (
        <group key={`crop-row-${rIdx}`} position={[0, 0.12, zRow]}>
          {/* Soil Mound */}
          <mesh receiveShadow>
            <boxGeometry args={[8.5, 0.15, 0.9]} />
            <meshStandardMaterial color="#3f2314" roughness={0.95} />
          </mesh>

          {/* Individual Crop Stems / Heads */}
          {Array.from({ length: 9 }).map((_, cIdx) => {
            const xPos = -3.8 + cIdx * 0.95;
            const cropH = 0.45 + (cIdx % 3) * 0.12;
            return (
              <group key={`crop-${cIdx}`} position={[xPos, 0.1, 0]}>
                {/* Stem */}
                <mesh position={[0, cropH / 2, 0]}>
                  <cylinderGeometry args={[0.03, 0.04, cropH, 6]} />
                  <meshStandardMaterial color="#15803d" />
                </mesh>
                {/* Crop Foliage Sphere / Tassel */}
                <mesh position={[0, cropH + 0.08, 0]}>
                  <sphereGeometry args={[0.16, 8, 8]} />
                  <meshStandardMaterial color={rIdx % 2 === 0 ? '#4ade80' : '#84cc16'} roughness={0.6} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* 3. Irrigation Pipes & Drip Lines */}
      <group position={[0, 0.18, 0]}>
        {/* Main Header Pipe */}
        <mesh position={[-4.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 8.5, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Lateral Distribution Lines */}
        {[-3.6, -1.8, 0, 1.8, 3.6].map((zLine, lIdx) => (
          <mesh key={`irr-line-${lIdx}`} position={[0, 0, zLine]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 8.6, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
        ))}
        {/* Subtle Water Flow Glow Indicator */}
        <mesh ref={waterFlowRef} position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* 4. Soil IoT Sensors with Blinking LEDs */}
      {[
        [-2.5, 0.25, -2],
        [2, 0.25, 1.5],
        [-1, 0.25, 3.2],
      ].map(([sx, sy, sz], sIdx) => (
        <group key={`soil-sensor-${sIdx}`} position={[sx, sy, sz]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Status LED */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {/* 5. Weather Sensor Mast (Anemometer, solar irradiance, ambient temperature) */}
      <group position={[4.6, 0, -4.2]}>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 3.2, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        {/* Anemometer spinning arm */}
        <group ref={anemometerRef} position={[0, 3.2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        </group>
        {/* Solar irradiance sensor plate */}
        <mesh position={[0, 2.7, 0.15]} rotation={[-Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.25, 0.04, 0.25]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} />
        </mesh>
      </group>

      {/* 6. Agrivoltaic Solar Panels Canopies */}
      <group position={[-4.5, 2.2, 2.5]}>
        {/* Support columns */}
        <mesh position={[-0.8, -1, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0.8, -1, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        {/* Solar Tilt Panel */}
        <mesh rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[2.2, 0.06, 1.8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} emissive="#0369a1" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* 7. Modern Cylindrical Water Tank Tower */}
      <group position={[4.6, 0, 3.8]}>
        {/* Tower legs */}
        <mesh position={[-0.5, 1, -0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.5, 1, -0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 1, 0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Reservoir Drum */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 1.6, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Water Level Gauge Window */}
        <mesh position={[0, 2.5, 1.12]}>
          <planeGeometry args={[0.2, 1.2]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 8. Agricultural Drone Flying and Scanning Over Crops */}
      {droneActive && (
        <CityDrone
          centerPosition={[0, 3.2, 0]}
          flightRadius={3.8}
          flightHeight={3.2}
          speed={0.9}
          type="agri"
          scanColor="#22c55e"
        />
      )}
    </InteractiveZone>
  );
};
