import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShoppingCart } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface SmartCartProps {
  initialPosition: [number, number, number];
  patrolAisle?: 'left' | 'right';
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SmartCart: React.FC<SmartCartProps> = ({
  initialPosition,
  patrolAisle = 'left',
  onSelectNode,
  isNight = false,
}) => {
  const cartGroupRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle motion along aisle
    if (cartGroupRef.current) {
      const zOffset = Math.sin(t * 0.5 + (patrolAisle === 'left' ? 0 : 2)) * 2.2;
      cartGroupRef.current.position.z = initialPosition[2] + zOffset;
      // Slight hover floating
      cartGroupRef.current.position.y = initialPosition[1] + Math.sin(t * 3) * 0.03;
    }

    // Cart product scanner beam pulse
    if (scanBeamRef.current) {
      scanBeamRef.current.scale.y = 1 + Math.sin(t * 6) * 0.3;
    }
  });

  return (
    <group
      ref={cartGroupRef}
      position={[initialPosition[0], initialPosition[1], initialPosition[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode({
          id: `smart-cart-${patrolAisle}`,
          name: `Autonomous AI Shopping Cart #${patrolAisle === 'left' ? '04' : '07'}`,
          category: 'Smart In-Store Mobility',
          status: 'optimal',
          efficiency: 98.6,
          powerKw: 0.35,
          description:
            'Autonomous obstacle-avoiding smart cart fitted with interior millimeter-wave scales, RFID basket tallying, dynamic route guidance, and follow-me customer tracking.',
          telemetryFields: [
            { label: 'Battery Level', value: '88% Inductive Charge' },
            { label: 'Basket Weight', value: '4.50 kg' },
            { label: 'Items Tally', value: '3 Organic Products' },
            { label: 'Auto-Follow Mode', value: 'Active (BLE Beacon #C-12)' },
          ],
        });
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Base Hover Skid / Chassis */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.9, 0.12, 1.3]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* 4 Glowing Wheels / Hover Pods */}
      {[
        [-0.48, 0.1, -0.45],
        [0.48, 0.1, -0.45],
        [-0.48, 0.1, 0.45],
        [0.48, 0.1, 0.45],
      ].map(([wx, wy, wz], wIdx) => (
        <mesh key={`wheel-${wIdx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* Wire Mesh Basket */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.85, 0.65, 1.2]} />
        <meshStandardMaterial
          color="#cbd5e1"
          wireframe
          metalness={0.9}
        />
      </mesh>

      {/* Contents inside basket */}
      <mesh position={[-0.15, 0.5, 0.2]}>
        <cylinderGeometry args={[0.15, 0.18, 0.28, 8]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>
      <mesh position={[0.15, 0.45, -0.2]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Handle with Scanner Array */}
      <mesh position={[0, 0.95, -0.65]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} />
      </mesh>

      {/* Front Tablet Screen (Displays Live Cart Total) */}
      <mesh position={[0, 0.88, 0.62]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.42, 0.26, 0.04]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.5} />
      </mesh>

      {/* Scanner Cone Down into Basket */}
      <mesh ref={scanBeamRef} position={[0, 0.9, 0]}>
        <coneGeometry args={[0.4, 0.5, 8, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Cart Label */}
      <Html position={[0, 1.35, 0]} center distanceFactor={8} className="pointer-events-none select-none">
        <div className="bg-slate-950/85 border border-sky-400/80 px-2 py-0.5 rounded-full text-[8px] font-mono text-sky-200 flex items-center gap-1 shadow-md">
          <ShoppingCart className="w-2.5 h-2.5 text-sky-400" />
          SMART CART
        </div>
      </Html>
    </group>
  );
};
