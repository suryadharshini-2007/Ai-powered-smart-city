import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveZone } from './InteractiveZone';
import { ShoppingBag, Bot } from 'lucide-react';
import { theme } from '../theme/visualTheme';
import { MarketStall } from '../market/MarketStall';
import { ProductDisplay } from '../market/ProductDisplay';
import { PriceBoard } from '../market/PriceBoard';

interface MarketZoneProps {
  position?: [number, number, number];
  onSelect?: () => void;
}

export const MarketZone: React.FC<MarketZoneProps> = ({
  position = [14, 0, 14],
  onSelect,
}) => {
  const robotRef = useRef<THREE.Group>(null);
  const signGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (robotRef.current) {
      const t = clock.getElapsedTime() * 1.5;
      robotRef.current.position.x = Math.sin(t) * 1.2;
      robotRef.current.position.z = Math.cos(t) * 0.8 + 2.2;
      robotRef.current.rotation.y = t + Math.PI / 2;
    }
  });

  const stalls = [
    {
      position: [-2.2, 0, 0.5] as [number, number, number],
      products: [
        { type: 'rice' as const, price: 65 },
        { type: 'wheat' as const, price: 55 },
      ],
    },
    {
      position: [2.2, 0, 0.5] as [number, number, number],
      products: [
        { type: 'tomato' as const, price: 40 },
        { type: 'vegetable' as const, price: 35 },
      ],
    },
  ];

  return (
    <InteractiveZone
      id="market"
      name="SMART MARKET"
      route="/zone/market"
      position={position}
      color="#f59e0b"
      statusText="Traffic: 420 shoppers"
      healthMetric="Zero-Waste Certified"
      subStatus="Farm Direct"
      onSelect={onSelect}
      tooltipOffset={[0, 4.8, 0]}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color={theme.infrastructure.grassFresh} roughness={0.7} />
      </mesh>

      <group position={[0, 0, -1]}>
        <mesh position={[0, 2.8, 0]}>
          <coneGeometry args={[4.2, 1.8, 8]} />
          <meshStandardMaterial
            color={theme.market.shopFront1}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={0.88}
          />
        </mesh>
        {[
          [-2.8, 1.2, -2],
          [2.8, 1.2, -2],
          [-2.8, 1.2, 2],
          [2.8, 1.2, 2],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`market-col-${idx}`} position={[cx, cy, cz]}>
            <cylinderGeometry args={[0.09, 0.09, 2.4, 8]} />
            <meshStandardMaterial color={theme.market.shopFront2} metalness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 3.75, 0]}>
          <torusGeometry args={[1.2, 0.1, 12, 24]} />
          <meshStandardMaterial color={theme.infrastructure.streetLight} emissive={theme.infrastructure.streetLight} emissiveIntensity={0.6} />
        </mesh>
      </group>

      <group position={[0, 3.9, 1.8]}>
        <mesh ref={signGlowRef}>
          <boxGeometry args={[3.8, 0.6, 0.12]} />
          <meshStandardMaterial color={theme.market.priceDisplay} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.6, 0.45]} />
          <meshStandardMaterial color={theme.market.shopFront3} emissive={theme.market.shopFront3} emissiveIntensity={0.8} />
        </mesh>
        <Html position={[0, 0, 0.1]} center distanceFactor={18}>
          <div className="px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-heading font-extrabold text-[10px] tracking-wider uppercase select-none shadow-md">
            BIO-AGRI SMART MARKET
          </div>
        </Html>
      </group>

      {stalls.map((stall, idx) => (
        <MarketStall key={idx} position={stall.position}>
          {stall.products.map((p, pIdx) => (
            <React.Fragment key={pIdx}>
              <ProductDisplay type={p.type} position={[pIdx * 0.7 - 0.35, 0.45, 0]} />
              <PriceBoard price={p.price} position={[pIdx * 0.7 - 0.35, 1.2, 0]} />
            </React.Fragment>
          ))}
        </MarketStall>
      ))}

      <group ref={robotRef} position={[0, 0, 2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.35, 12]} />
          <meshStandardMaterial color={theme.market.robotAccent} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshStandardMaterial color={theme.market.shopFront3} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.48, 0.12]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={theme.market.priceDisplay} emissive={theme.market.priceDisplay} emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0.35, 0.28]}>
          <boxGeometry args={[0.25, 0.12, 0.2]} />
          <meshStandardMaterial color={theme.market.priceDisplay} />
        </mesh>
      </group>

      {[-0.8, 0.8].map((px, idx) => (
        <group key={`checkout-${idx}`} position={[px, 0, -2.4]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
            <meshStandardMaterial color={theme.market.shopFront2} />
          </mesh>
          <mesh position={[0, 1.15, 0.05]} rotation={[-Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.28, 0.38, 0.04]} />
            <meshStandardMaterial color={theme.market.priceDisplay} emissive={theme.market.priceDisplay} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </InteractiveZone>
  );
};
