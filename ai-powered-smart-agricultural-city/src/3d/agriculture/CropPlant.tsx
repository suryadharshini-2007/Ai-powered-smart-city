import React from 'react';
import * as THREE from 'three';

interface CropPlantProps {
  position: [number, number, number];
  isDiseased?: boolean;
  isScanned?: boolean;
  scale?: number;
  onClick?: (e: any) => void;
}

export const CropPlant: React.FC<CropPlantProps> = ({
  position,
  isDiseased = false,
  isScanned = false,
  scale = 1,
  onClick,
}) => {
  // Leaf and fruit colors based on health
  const healthyStem = '#15803d';
  const diseasedStem = '#854d0e';
  const healthyLeaf = '#22c55e';
  const diseasedLeaf = '#ca8a04';
  const leafSpotColor = '#713f12';

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onClick={onClick}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Central Stem */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.7, 6]} />
        <meshStandardMaterial
          color={isDiseased ? diseasedStem : healthyStem}
          roughness={0.7}
        />
      </mesh>

      {/* Foliage Leaf Layer 1 (Lower) */}
      <group position={[0, 0.25, 0]}>
        <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.26, 0.02, 0.1]} />
          <meshStandardMaterial
            color={isDiseased ? diseasedLeaf : healthyLeaf}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[-0.15, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.26, 0.02, 0.1]} />
          <meshStandardMaterial
            color={isDiseased ? diseasedLeaf : healthyLeaf}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Foliage Leaf Layer 2 (Middle - Offset 90 deg) */}
      <group position={[0, 0.45, 0]}>
        <mesh position={[0, 0.05, 0.16]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.28]} />
          <meshStandardMaterial
            color={isDiseased ? diseasedLeaf : healthyLeaf}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[0, 0.05, -0.16]} rotation={[-Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.28]} />
          <meshStandardMaterial
            color={isDiseased ? diseasedLeaf : healthyLeaf}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Foliage Leaf Layer 3 (Upper Canopy) */}
      <group position={[0, 0.65, 0]}>
        <mesh position={[0.12, 0.05, 0.08]} rotation={[0.2, 0.5, -0.3]}>
          <boxGeometry args={[0.2, 0.02, 0.1]} />
          <meshStandardMaterial
            color={isDiseased ? diseasedLeaf : healthyLeaf}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[-0.12, 0.05, -0.08]} rotation={[-0.2, -0.5, 0.3]}>
          <boxGeometry args={[0.2, 0.02, 0.1]} />
          <meshStandardMaterial
            color={isDiseased ? diseasedLeaf : healthyLeaf}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Crop Fruit / Grain Head (e.g. Golden wheat / corn / organic tomato) */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial
          color={isDiseased ? '#a16207' : '#eab308'}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Visible Disease Blight Spots on affected plants */}
      {isDiseased && (
        <group position={[0.14, 0.3, 0]}>
          <mesh>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color={leafSpotColor} />
          </mesh>
        </group>
      )}

      {/* AI Scan Highlight Indicator / Bounding box when scanned */}
      {isScanned && (
        <group position={[0, 0.45, 0]}>
          <mesh>
            <boxGeometry args={[0.55, 0.9, 0.55]} />
            <meshBasicMaterial
              color={isDiseased ? '#ef4444' : '#10b981'}
              wireframe
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.3, 16]} />
            <meshBasicMaterial
              color={isDiseased ? '#ef4444' : '#10b981'}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
