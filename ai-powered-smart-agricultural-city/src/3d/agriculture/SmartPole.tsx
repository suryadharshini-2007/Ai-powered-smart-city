import React from 'react';
import * as THREE from 'three';

interface SmartPoleProps {
  position: [number, number, number];
  isNight?: boolean;
}

export const SmartPole: React.FC<SmartPoleProps> = ({ position, isNight = false }) => {
  return (
    <group position={position}>
      {/* Concrete Foundation */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Main Steel Mast */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.2, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>

      {/* IoT Sensor Collar */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Luminaire Arm */}
      <group position={[0, 4.1, 0]}>
        <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -Math.PI / 12]}>
          <boxGeometry args={[0.7, 0.04, 0.06]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* LED Lamp Head */}
        <mesh position={[0.65, 0, 0]}>
          <boxGeometry args={[0.3, 0.06, 0.15]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.65, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.26, 0.12]} />
          <meshStandardMaterial
            color={isNight ? '#fef08a' : '#94a3b8'}
            emissive={isNight ? '#fef08a' : '#000000'}
            emissiveIntensity={isNight ? 2 : 0}
          />
        </mesh>

        {/* Smart CCTV 360 Dome */}
        <mesh position={[0.4, -0.1, 0]}>
          <sphereGeometry args={[0.06, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
