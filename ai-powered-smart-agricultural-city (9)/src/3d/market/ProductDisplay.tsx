import React from 'react';
import * as THREE from 'three';
import { theme } from '../theme/visualTheme';

interface ProductDisplayProps {
  type: 'rice' | 'wheat' | 'tomato' | 'vegetable';
  position: [number, number, number];
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({ type, position }) => {
  // Choose geometry and color based on product type
  let geometry: JSX.Element;
  let materialColor: string;
  switch (type) {
    case 'rice':
      geometry = <boxGeometry args={[0.4, 0.3, 0.2]} />;
      materialColor = theme.market.grainBrown; // brownish grain bag
      break;
    case 'wheat':
      geometry = <boxGeometry args={[0.4, 0.3, 0.2]} />;
      materialColor = theme.market.grainBrown;
      break;
    case 'tomato':
      geometry = <sphereGeometry args={[0.15, 12, 12]} />;
      materialColor = theme.market.tomatoRed;
      break;
    case 'vegetable':
      geometry = <boxGeometry args={[0.2, 0.3, 0.2]} />;
      materialColor = theme.market.vegGreen;
      break;
    default:
      geometry = <boxGeometry args={[0.3, 0.3, 0.3]} />;
      materialColor = '#ffffff';
  }

  return (
    <mesh position={position} castShadow receiveShadow>
      {geometry}
      <meshStandardMaterial color={materialColor} roughness={0.4} />
    </mesh>
  );
};
