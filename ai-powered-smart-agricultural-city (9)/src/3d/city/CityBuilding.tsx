import React from 'react';
import * as THREE from 'three';

interface CityBuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  roofColor?: string;
  windowColor?: string;
  hasSolarRoof?: boolean;
  hasAntenna?: boolean;
  hasGreenery?: boolean;
  rotation?: [number, number, number];
}

export const CityBuilding: React.FC<CityBuildingProps> = ({
  position,
  size,
  color = '#1e293b',
  roofColor = '#0f172a',
  windowColor = '#38bdf8',
  hasSolarRoof = false,
  hasAntenna = false,
  hasGreenery = false,
  rotation = [0, 0, 0],
}) => {
  const [w, h, d] = size;

  return (
    <group position={position} rotation={rotation}>
      {/* Main Building Body */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Roof trim */}
      <mesh position={[0, h + 0.05, 0]}>
        <boxGeometry args={[w * 1.02, 0.1, d * 1.02]} />
        <meshStandardMaterial color={roofColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Decorative vertical window strips */}
      {h > 2 && (
        <>
          <mesh position={[0, h / 2, d / 2 + 0.02]}>
            <planeGeometry args={[w * 0.7, h * 0.75]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={0.35}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, h / 2, -d / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[w * 0.7, h * 0.75]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={0.35}
              roughness={0.1}
            />
          </mesh>
        </>
      )}

      {/* Rooftop Solar Panels */}
      {hasSolarRoof && (
        <group position={[0, h + 0.15, 0]}>
          <mesh rotation={[-Math.PI / 12, 0, 0]}>
            <boxGeometry args={[w * 0.7, 0.05, d * 0.6]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.1}
              metalness={0.9}
              emissive="#0369a1"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Panel stand */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[w * 0.3, 0.1, d * 0.3]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      )}

      {/* Rooftop Telemetry Antenna / Beacon */}
      {hasAntenna && (
        <group position={[w * 0.3, h + 0.6, d * 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.05, 1.2, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Beacon tip */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
          </mesh>
          <pointLight position={[0, 0.6, 0]} color="#ef4444" distance={2} intensity={1} />
        </group>
      )}

      {/* Green Living Terraces / Balcony */}
      {hasGreenery && (
        <group position={[0, h * 0.45, d / 2 + 0.15]}>
          <mesh>
            <boxGeometry args={[w * 0.85, 0.25, 0.3]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} />
          </mesh>
          {/* Foliage sprouts */}
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[w * 0.8, 0.15, 0.25]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};
