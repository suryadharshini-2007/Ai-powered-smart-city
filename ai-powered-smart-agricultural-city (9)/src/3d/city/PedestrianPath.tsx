import React from 'react';
import * as THREE from 'three';

interface PedestrianPathProps {
  start: [number, number];
  end: [number, number];
  width?: number;
  hasStreetlights?: boolean;
  hasTrees?: boolean;
}

export const PedestrianPath: React.FC<PedestrianPathProps> = ({
  start,
  end,
  width = 1.8,
  hasStreetlights = true,
  hasTrees = true,
}) => {
  const [x1, z1] = start;
  const [x2, z2] = end;

  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.hypot(dx, dz);
  const midX = (x1 + x2) / 2;
  const midZ = (z1 + z2) / 2;
  const angle = Math.atan2(dx, dz);

  // Number of trees and lights along the walkway
  const segments = Math.max(2, Math.floor(length / 5));

  return (
    <group position={[midX, 0.02, midZ]} rotation={[0, angle, 0]}>
      {/* Paved Walkway Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Decorative Walkway Border Edges */}
      <mesh position={[-width / 2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, length]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </mesh>
      <mesh position={[width / 2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, length]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </mesh>

      {/* Streetlights along edge */}
      {hasStreetlights &&
        Array.from({ length: segments }).map((_, i) => {
          const zOffset = -length / 2 + (i + 0.5) * (length / segments);
          return (
            <group key={`light-${i}`} position={[width / 2 + 0.35, 0, zOffset]}>
              {/* Pole */}
              <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 2.8, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} />
              </mesh>
              {/* Overhanging Arm */}
              <mesh position={[-0.25, 2.75, 0]} rotation={[0, 0, Math.PI / 5]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
              {/* Luminaire Head */}
              <mesh position={[-0.45, 2.65, 0]}>
                <boxGeometry args={[0.22, 0.05, 0.12]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
              </mesh>
              {/* Smart CCTV Node on pole */}
              <mesh position={[0, 2.1, 0.08]}>
                <boxGeometry args={[0.08, 0.08, 0.12]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <mesh position={[0, 2.1, 0.14]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          );
        })}

      {/* Urban Trees along opposite edge */}
      {hasTrees &&
        Array.from({ length: segments }).map((_, i) => {
          const zOffset = -length / 2 + (i + 0.5) * (length / segments);
          return (
            <group key={`tree-${i}`} position={[-width / 2 - 0.5, 0, zOffset]}>
              {/* Planter Box */}
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.7, 0.3, 0.7]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
              </mesh>
              {/* Soil */}
              <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.6, 0.6]} />
                <meshStandardMaterial color="#451a03" roughness={0.9} />
              </mesh>
              {/* Trunk */}
              <mesh position={[0, 0.9, 0]}>
                <cylinderGeometry args={[0.06, 0.09, 1.3, 8]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} />
              </mesh>
              {/* Foliage Canopy */}
              <mesh position={[0, 1.8, 0]}>
                <sphereGeometry args={[0.55, 10, 10]} />
                <meshStandardMaterial color="#22c55e" roughness={0.7} />
              </mesh>
              <mesh position={[0, 2.3, 0]}>
                <sphereGeometry args={[0.4, 8, 8]} />
                <meshStandardMaterial color="#16a34a" roughness={0.7} />
              </mesh>
            </group>
          );
        })}
    </group>
  );
};
