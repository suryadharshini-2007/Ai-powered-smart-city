import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { InflatableBarrierState } from './TrafficTypes';

interface InflatableBarrierProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  barrierState: InflatableBarrierState;
  isNight?: boolean;
}

export const InflatableBarrier: React.FC<InflatableBarrierProps> = ({
  onSelectNode,
  barrierState,
  isNight = false,
}) => {
  const cushionGroupRef = useRef<THREE.Group>(null);
  const currentScaleY = useRef(0.1);
  const currentScaleZ = useRef(0.3);

  useFrame((_, delta) => {
    if (!cushionGroupRef.current) return;

    // Target scale:
    // Deflated: scaleY = 0.12, scaleZ = 0.35
    // Inflated: scaleY = 1.0, scaleZ = 1.0
    const targetY = barrierState.inflated ? 1.0 : 0.12;
    const targetZ = barrierState.inflated ? 1.0 : 0.35;

    // Fast pneumatic deployment lerp
    currentScaleY.current = THREE.MathUtils.lerp(
      currentScaleY.current,
      targetY,
      delta * 5.0
    );
    currentScaleZ.current = THREE.MathUtils.lerp(
      currentScaleZ.current,
      targetZ,
      delta * 4.5
    );

    cushionGroupRef.current.scale.set(1.0, currentScaleY.current, currentScaleZ.current);
  });

  const handleSelect = () => {
    onSelectNode({
      id: 'inflatable-safety-barrier-01',
      name: 'Pneumatic Rapid-Deploy Inflatable Safety Barrier',
      category: 'Passive & Active Crash Attenuation',
      status: barrierState.inflated ? 'active' : 'optimal',
      efficiency: 99.6,
      powerKw: 0.12,
      description: 'Micro-pyrotechnic high-speed pneumatic crash cushion. Deploys within 240 milliseconds of trajectory danger detection, redirecting rogue vehicles away from pedestrian sidewalks.',
      telemetryFields: [
        { label: 'Barrier State', value: barrierState.status },
        { label: 'Deployment Pressure', value: barrierState.inflated ? '4.8 Bar (MAX)' : '0.2 Bar (PRE-CHARGE)' },
        { label: 'Absorption Capacity', value: '420 kJ' },
        { label: 'Pedestrian Shield', value: barrierState.inflated ? 'PROTECTED (100%)' : 'STANDBY' },
      ],
    });
  };

  return (
    <group
      position={[8.5, 0.12, 10.5]}
      rotation={[0, -Math.PI / 4, 0]}
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
      {/* Heavy Steel Base Trench / Anchoring Tray */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.16, 1.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* High-Pressure Pneumatic Tank Pod on side */}
      <group position={[-2.4, 0.25, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Pressure Manometer Gauge */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Status Indicator LED */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color={barrierState.inflated ? '#ef4444' : '#22c55e'}
            emissive={barrierState.inflated ? '#ef4444' : '#22c55e'}
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* DYNAMIC INFLATABLE CUSHION GROUP (Morphs scaleY & scaleZ) */}
      <group ref={cushionGroupRef} position={[0, 0.16, 0]}>
        {/* Main Cushion Chamber */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[4.0, 1.3, 1.1]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>

        {/* High-Visibility Black Chevron Decals on Face */}
        {[-1.2, 0, 1.2].map((x) => (
          <group key={`chevron-${x}`} position={[x, 0.65, 0.56]}>
            <mesh>
              <planeGeometry args={[0.7, 1.1]} />
              <meshStandardMaterial color="#090d16" roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Top Shock-Absorbing Ribbing Tubes */}
        <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 4.0, 16]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.3} />
        </mesh>
      </group>

      {/* Safety Status Hologram / Text Badge in 3D */}
      {barrierState.impactRisk && (
        <group position={[0, 2.2, 0]}>
          <mesh>
            <planeGeometry args={[3.2, 0.5]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={2.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
