import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnimatedPedestrianProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  speed?: number;
  initialProgress?: number;
  color?: string;
  onFootstep?: (position: [number, number, number]) => void;
}

export const AnimatedPedestrian: React.FC<AnimatedPedestrianProps> = ({
  startPos,
  endPos,
  speed = 1.2,
  initialProgress = 0,
  color = '#38bdf8',
  onFootstep,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const progressRef = useRef(initialProgress);
  const lastStepPhase = useRef(0);

  const [startX, startY, startZ] = startPos;
  const [endX, endY, endZ] = endPos;
  const distance = Math.hypot(endX - startX, endZ - startZ);
  const angle = Math.atan2(endX - startX, endZ - startZ);

  useFrame(({ clock }, delta) => {
    // Progress calculation
    progressRef.current = (progressRef.current + (speed * delta) / distance) % 1;
    const p = progressRef.current;

    const currentX = startX + (endX - startX) * p;
    const currentZ = startZ + (endZ - startZ) * p;
    const currentY = startY;

    if (groupRef.current) {
      groupRef.current.position.set(currentX, currentY, currentZ);
      groupRef.current.rotation.y = angle;
    }

    // Walking animation kinematics
    const t = clock.getElapsedTime() * speed * 7;
    const legSwing = Math.sin(t) * 0.55;
    const armSwing = Math.cos(t) * 0.45;

    if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

    // Detect foot strike near apex of cycle
    const currentPhase = Math.sin(t);
    if (Math.abs(currentPhase) > 0.95 && Math.abs(lastStepPhase.current) <= 0.95) {
      if (onFootstep) {
        onFootstep([currentX, currentY, currentZ]);
      }
    }
    lastStepPhase.current = currentPhase;
  });

  return (
    <group ref={groupRef} position={startPos}>
      {/* Head */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.5} />
      </mesh>

      {/* Smart visor / AR glasses */}
      <mesh position={[0, 0.73, 0.08]}>
        <boxGeometry args={[0.12, 0.03, 0.04]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </mesh>

      {/* Torso / Jacket */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.22, 0.28, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Backpack / IoT Personal Battery */}
      <mesh position={[0, 0.5, -0.1]}>
        <boxGeometry args={[0.16, 0.2, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.14, 0.45, 0]}>
        <boxGeometry args={[0.05, 0.24, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.14, 0.45, 0]}>
        <boxGeometry args={[0.05, 0.24, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.06, 0.18, 0]}>
        <boxGeometry args={[0.07, 0.36, 0.07]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.06, 0.18, 0]}>
        <boxGeometry args={[0.07, 0.36, 0.07]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};
