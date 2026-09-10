import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { PedestrianCrossingState } from './TrafficTypes';

interface PedestrianSafetyGatesProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  crossingState: PedestrianCrossingState;
  isNight?: boolean;
}

export const PedestrianSafetyGates: React.FC<PedestrianSafetyGatesProps> = ({
  onSelectNode,
  crossingState,
  isNight = false,
}) => {
  // Gate barrier arm rotations
  // Normal state: arm raised up (vertical, -Math.PI / 2)
  // Deployed / closed vehicle path state: arm lowered down horizontally across road (0)
  const westGateArmRef = useRef<THREE.Group>(null);
  const eastGateArmRef = useRef<THREE.Group>(null);

  // Pedestrian group reference for walking across
  const ped1Ref = useRef<THREE.Group>(null);
  const ped2Ref = useRef<THREE.Group>(null);
  const ped3Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Determine target gate angle:
    // When crossing is active (steps 3 to 7), gates are DOWN (closed to vehicles: angle 0)
    // When idle/normal (steps 0, 1, 8), gates are UP (open for traffic: angle -Math.PI / 2)
    const isGateLowered = crossingState.active && crossingState.step >= 3 && crossingState.step <= 7;
    const targetAngle = isGateLowered ? 0 : -Math.PI / 2;

    if (westGateArmRef.current) {
      westGateArmRef.current.rotation.z = THREE.MathUtils.lerp(
        westGateArmRef.current.rotation.z,
        targetAngle,
        delta * 3.5
      );
    }
    if (eastGateArmRef.current) {
      eastGateArmRef.current.rotation.z = THREE.MathUtils.lerp(
        eastGateArmRef.current.rotation.z,
        -targetAngle,
        delta * 3.5
      );
    }

    // Animate pedestrians walking across the zebra crossing (z = 9, moving from x = -7 to x = +7)
    if (crossingState.active && crossingState.step >= 5 && crossingState.step <= 7) {
      const progress = crossingState.pedestrianProgress; // 0 to 1
      const xPos = -6.5 + progress * 13;

      if (ped1Ref.current) {
        ped1Ref.current.position.set(xPos, 0.1, 8.2);
        // leg walk bob
        ped1Ref.current.position.y = 0.1 + Math.abs(Math.sin(progress * 40)) * 0.08;
      }
      if (ped2Ref.current) {
        ped2Ref.current.position.set(xPos - 1.2, 0.1, 9.2);
        ped2Ref.current.position.y = 0.1 + Math.abs(Math.sin(progress * 40 + 1)) * 0.08;
      }
      if (ped3Ref.current) {
        ped3Ref.current.position.set(xPos - 2.0, 0.1, 9.8);
        ped3Ref.current.position.y = 0.1 + Math.abs(Math.sin(progress * 40 + 2)) * 0.08;
      }
    } else {
      // Waiting on sidewalk (x ~ -7.5)
      if (ped1Ref.current) ped1Ref.current.position.set(-7.6, 0.15, 8.2);
      if (ped2Ref.current) ped2Ref.current.position.set(-8.4, 0.15, 9.2);
      if (ped3Ref.current) ped3Ref.current.position.set(-8.0, 0.15, 9.8);
    }
  });

  const handleSelect = () => {
    onSelectNode({
      id: 'pedestrian-safety-gates-south',
      name: 'Automated Smart Pedestrian Safety Gates',
      category: 'Pedestrian Protection System',
      status: crossingState.active ? 'active' : 'optimal',
      efficiency: 99.8,
      powerKw: 0.25,
      description: 'Electro-mechanical impact-resistant barrier arms with optical pedestrian sensors. Interlocks directly with junction signals to create a physical protective barrier between pedestrians and vehicles.',
      telemetryFields: [
        { label: 'Gate Status', value: crossingState.active && crossingState.step >= 3 && crossingState.step <= 7 ? 'DEPLOYED (VEHICLES BLOCKED)' : 'RETRACTED (LANE OPEN)' },
        { label: 'Crossing Sequence', value: `Step ${crossingState.step} / 8` },
        { label: 'Signal Override', value: crossingState.active ? 'ALL-RED VEHICLE STOP' : 'NORMAL CYCLE' },
        { label: 'Sensor Interlock', value: 'LiDAR Zone Guard ACTIVE' },
      ],
    });
  };

  // Helper to render stylized pedestrian model
  const renderPedestrian = (shirtColor: string) => (
    <group>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.5} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.34, 0.6, 0.2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, 0.38, 0]}>
        <boxGeometry args={[0.12, 0.72, 0.14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.38, 0]}>
        <boxGeometry args={[0.12, 0.72, 0.14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        handleSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* WEST SIDE GATE HOUSING & ARM (South Crossing: x = -7, z = 10.5) */}
      <group position={[-7, 0, 10.5]}>
        {/* Foundation Housing Post */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.45, 1.2, 0.45]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Flashing Status LED on top of Post */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          <meshStandardMaterial
            color={crossingState.active ? '#ef4444' : '#22c55e'}
            emissive={crossingState.active ? '#ef4444' : '#22c55e'}
            emissiveIntensity={2}
          />
        </mesh>

        {/* Pivot Hinge & Barrier Arm */}
        <group ref={westGateArmRef} position={[0.2, 1.0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          {/* Hinge Pin */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          {/* Barrier Arm (6.5m length across half the road) */}
          <mesh position={[3.2, 0, 0]}>
            <boxGeometry args={[6.4, 0.12, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Red/White Warning Hazard Stripes */}
          {[-1.5, 0, 1.5, 3.0, 4.5].map((xOffset) => (
            <mesh key={`stripe-w-${xOffset}`} position={[1.5 + xOffset, 0, 0.032]}>
              <planeGeometry args={[0.6, 0.12]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
            </mesh>
          ))}
          {/* Arm LED Guide lights */}
          <mesh position={[6.3, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>

      {/* EAST SIDE GATE HOUSING & ARM (South Crossing: x = 7, z = 10.5) */}
      <group position={[7, 0, 10.5]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.45, 1.2, 0.45]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          <meshStandardMaterial
            color={crossingState.active ? '#ef4444' : '#22c55e'}
            emissive={crossingState.active ? '#ef4444' : '#22c55e'}
            emissiveIntensity={2}
          />
        </mesh>

        {/* Pivot Hinge & Barrier Arm */}
        <group ref={eastGateArmRef} position={[-0.2, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[-3.2, 0, 0]}>
            <boxGeometry args={[6.4, 0.12, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {[-1.5, 0, 1.5, 3.0, 4.5].map((xOffset) => (
            <mesh key={`stripe-e-${xOffset}`} position={[-1.5 - xOffset, 0, 0.032]}>
              <planeGeometry args={[0.6, 0.12]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
            </mesh>
          ))}
          <mesh position={[-6.3, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>

      {/* ANIMATED PEDESTRIANS */}
      <group ref={ped1Ref} position={[-7.6, 0.15, 8.2]} rotation={[0, Math.PI / 2, 0]}>
        {renderPedestrian('#0284c7')}
      </group>
      <group ref={ped2Ref} position={[-8.4, 0.15, 9.2]} rotation={[0, Math.PI / 2, 0]}>
        {renderPedestrian('#f59e0b')}
      </group>
      <group ref={ped3Ref} position={[-8.0, 0.15, 9.8]} rotation={[0, Math.PI / 2, 0]}>
        {renderPedestrian('#10b981')}
      </group>
    </group>
  );
};
