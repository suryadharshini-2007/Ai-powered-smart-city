import React from 'react';
import * as THREE from 'three';
import { theme } from '../theme/visualTheme';

interface MarketStallProps {
  position: [number, number, number];
  children?: React.ReactNode;
}

export const MarketStall: React.FC<MarketStallProps> = ({ position, children }) => {
  return (
    <group position={position}>
      {/* Stall base */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color={theme.market.shopFront1} />
      </mesh>
      {/* Stall roof */}
      <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
        <coneGeometry args={[1.5, 1, 4]} />
        <meshStandardMaterial color={theme.market.shopFront2} metalness={0.6} />
      </mesh>
      {/* Simple shelf */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.9]} />
        <meshStandardMaterial color={theme.market.shopFront3} />
      </mesh>
      {children}
    </group>
  );
};
