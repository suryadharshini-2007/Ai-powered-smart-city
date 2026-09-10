import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { theme } from '../theme/visualTheme';

interface PriceBoardProps {
  price: number;
  position: [number, number, number];
}

export const PriceBoard: React.FC<PriceBoardProps> = ({ price, position }) => {
  return (
    <group position={position}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[0.6, 0.25]} />
        <meshStandardMaterial
          color={theme.market.priceDisplay}
          emissive={theme.market.priceDisplay}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Price text */}
      <Html center distanceFactor={15}>
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '10px',
            color: '#111',
            background: 'rgba(255,255,255,0.8)',
            padding: '2px 4px',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          ₹{price}/kg
        </div>
      </Html>
    </group>
  );
};
