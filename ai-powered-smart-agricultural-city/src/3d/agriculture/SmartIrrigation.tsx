import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SmartIrrigationProps {
  fieldBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  rows: number;
  isIrrigating: boolean;
  intensity?: number; // 0 to 1
  onClick?: () => void;
}

export const SmartIrrigation: React.FC<SmartIrrigationProps> = ({
  fieldBounds,
  rows,
  isIrrigating,
  intensity = 0.8,
  onClick,
}) => {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate emitter positions along rows
  const emitters = useMemo(() => {
    const list: [number, number, number][] = [];
    const zStep = (fieldBounds.maxZ - fieldBounds.minZ) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      const z = fieldBounds.minZ + r * zStep;
      // 5 emitters per row
      for (let c = 0; c < 5; c++) {
        const x = fieldBounds.minX + 1.2 + c * ((fieldBounds.maxX - fieldBounds.minX - 2.4) / 4);
        list.push([x, 0.18, z]);
      }
    }
    return list;
  }, [fieldBounds, rows]);

  // Animated mist/droplet particles around emitters
  const particleCount = emitters.length * 8;
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < emitters.length; i++) {
      const [ex, ey, ez] = emitters[i];
      for (let p = 0; p < 8; p++) {
        const idx = (i * 8 + p) * 3;
        pos[idx] = ex + (Math.random() - 0.5) * 0.1;
        pos[idx + 1] = ey + Math.random() * 0.2;
        pos[idx + 2] = ez + (Math.random() - 0.5) * 0.1;

        vel[idx] = (Math.random() - 0.5) * 0.4;
        vel[idx + 1] = 0.2 + Math.random() * 0.5;
        vel[idx + 2] = (Math.random() - 0.5) * 0.4;
      }
    }
    return [pos, vel];
  }, [emitters, particleCount]);

  useFrame((_, delta) => {
    if (!particlesRef.current || !isIrrigating) return;

    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < emitters.length; i++) {
      const [ex, ey, ez] = emitters[i];
      for (let p = 0; p < 8; p++) {
        const idx = (i * 8 + p) * 3;
        // Move upward then fall like spray
        array[idx] += velocities[idx] * delta * intensity;
        array[idx + 1] += (velocities[idx + 1] - 0.6) * delta * intensity;
        array[idx + 2] += velocities[idx + 2] * delta * intensity;

        // Reset if below ground or too high
        if (array[idx + 1] < 0.05 || array[idx + 1] > 0.65) {
          array[idx] = ex + (Math.random() - 0.5) * 0.05;
          array[idx + 1] = ey;
          array[idx + 2] = ez + (Math.random() - 0.5) * 0.05;
        }
      }
    }
    posAttr.needsUpdate = true;
  });

  const zStep = (fieldBounds.maxZ - fieldBounds.minZ) / (rows - 1);

  return (
    <group
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* 1. Main Header Distribution Pipe (Runs along minX edge) */}
      <mesh
        position={[
          fieldBounds.minX - 0.2,
          0.08,
          (fieldBounds.minZ + fieldBounds.maxZ) / 2,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[0.07, 0.07, fieldBounds.maxZ - fieldBounds.minZ + 0.8, 12]}
        />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 2. Lateral Drip Lines running through each row */}
      {Array.from({ length: rows }).map((_, r) => {
        const z = fieldBounds.minZ + r * zStep;
        return (
          <group key={`pipe-row-${r}`}>
            <mesh
              position={[
                (fieldBounds.minX + fieldBounds.maxX) / 2,
                0.04,
                z,
              ]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry
                args={[0.03, 0.03, fieldBounds.maxX - fieldBounds.minX, 8]}
              />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.5}
                metalness={0.5}
              />
            </mesh>

            {/* Junction Valve to Header */}
            <mesh position={[fieldBounds.minX - 0.2, 0.08, z]}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
        );
      })}

      {/* 3. Micro Sprinklers / Emitters */}
      {emitters.map(([ex, ey, ez], i) => (
        <group key={`emitter-${i}`} position={[ex, ey, ez]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial
              color={isIrrigating ? '#06b6d4' : '#64748b'}
              emissive={isIrrigating ? '#06b6d4' : '#000000'}
              emissiveIntensity={isIrrigating ? 1 : 0}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Active Water Spray / Droplet Particles */}
      {isIrrigating && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#38bdf8"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};
