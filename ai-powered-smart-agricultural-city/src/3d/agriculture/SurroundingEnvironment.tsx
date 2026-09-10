import React from 'react';
import * as THREE from 'three';

export const SurroundingEnvironment: React.FC = () => {
  // Tree positions around the perimeter
  const trees: [number, number, number][] = [
    // North windbreak
    [-18, 0, -16],
    [-12, 0, -16],
    [-6, 0, -16],
    [0, 0, -16],
    [6, 0, -16],
    [12, 0, -16],
    [18, 0, -16],
    // South perimeter
    [-18, 0, 16],
    [-12, 0, 16],
    [-6, 0, 16],
    [0, 0, 16],
    [6, 0, 16],
    [12, 0, 16],
    [18, 0, 16],
    // West windbreak
    [-18, 0, -10],
    [-18, 0, -4],
    [-18, 0, 4],
    [-18, 0, 10],
    // East windbreak
    [18, 0, -10],
    [18, 0, -4],
    [18, 0, 4],
    [18, 0, 10],
  ];

  return (
    <group>
      {/* 1. Main Agricultural Grass/Soil Terrain Bed */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#14532d" roughness={0.8} />
      </mesh>

      {/* 2. Main Center Gravel / Access Road (connecting zones) */}
      {/* North-South Pathway */}
      <mesh position={[10, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 34]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* East-West Branch Pathway */}
      <mesh position={[-2, 0.01, 8.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 2.6]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* West Branch to Solar Field */}
      <mesh position={[-2, 0.01, -8.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 2.4]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* 3. Perimeter Windbreak Trees */}
      {trees.map(([tx, ty, tz], idx) => {
        const heightScale = 0.8 + ((idx * 13) % 10) * 0.04;
        return (
          <group key={`tree-${idx}`} position={[tx, ty, tz]} scale={[heightScale, heightScale, heightScale]}>
            {/* Trunk */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.28, 2.4, 8]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
            {/* Foliage Cones */}
            <mesh position={[0, 2.6, 0]} castShadow>
              <coneGeometry args={[1.4, 2.2, 8]} />
              <meshStandardMaterial color="#166534" roughness={0.6} />
            </mesh>
            <mesh position={[0, 3.8, 0]} castShadow>
              <coneGeometry args={[1.1, 1.8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.6} />
            </mesh>
            <mesh position={[0, 4.8, 0]} castShadow>
              <coneGeometry args={[0.7, 1.4, 8]} />
              <meshStandardMaterial color="#22c55e" roughness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* 4. Protective Windbreak Hedges along field boundaries */}
      {[-8.5, 8.5].map((hz, hIdx) => (
        <mesh key={`hedge-${hIdx}`} position={[-10, 0.4, hz]}>
          <boxGeometry args={[0.6, 0.8, 4]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};
