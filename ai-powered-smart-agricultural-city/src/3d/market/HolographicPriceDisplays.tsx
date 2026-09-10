import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Tag, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ProductDetail } from './MarketTypes';

interface HolographicPriceProps {
  position: [number, number, number];
  product: ProductDetail;
  onSelect: (product: ProductDetail) => void;
  highlightColor?: string;
  glowOffset?: number;
}

export const HolographicPriceTag: React.FC<HolographicPriceProps> = ({
  position,
  product,
  onSelect,
  highlightColor = '#06b6d4',
  glowOffset = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + glowOffset;
    if (groupRef.current) {
      // Gentle floating bob
      groupRef.current.position.y = position[1] + Math.sin(t * 2.2) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
    }
  });

  const isLowStock = product.stockStatus === 'Low Stock';

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* 3D Hologram Projection Base Emitter */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.08, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.2}
          emissive={highlightColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Rotating Holographic Emitter Ring */}
      <mesh ref={ringRef} position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.52, 24]} />
        <meshBasicMaterial
          color={isLowStock ? '#f59e0b' : highlightColor}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Light Projection Cone */}
      <mesh position={[0, -0.15, 0]}>
        <coneGeometry args={[0.6, 0.8, 16, 1, true]} />
        <meshBasicMaterial
          color={isLowStock ? '#f59e0b' : highlightColor}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Floating 3D Hologram UI Card */}
      <Html
        position={[0, 0.4, 0]}
        center
        distanceFactor={9}
        className="select-none pointer-events-auto"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className={`cursor-pointer group transition-all duration-300 transform hover:scale-105 ${
            isLowStock
              ? 'bg-amber-950/85 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'bg-slate-950/85 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
          } border rounded-xl px-3 py-2 backdrop-blur-md min-w-[135px] text-center font-mono`}
        >
          {/* Top holographic scanline & title */}
          <div className="flex items-center justify-between gap-1 text-[9px] uppercase tracking-wider font-bold opacity-80 mb-0.5">
            <span className="flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {product.id.replace('prod-', '')}
            </span>
            {isLowStock ? (
              <span className="flex items-center gap-0.5 text-amber-300 text-[8px] animate-pulse">
                <AlertTriangle className="w-2.5 h-2.5" /> LOW
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-emerald-400 text-[8px]">
                <CheckCircle2 className="w-2.5 h-2.5" /> FRESH
              </span>
            )}
          </div>

          {/* Large Holographic Price */}
          <div className="text-base font-extrabold tracking-tight drop-shadow-[0_0_8px_currentColor] my-0.5">
            {product.displayPrice}
          </div>

          {/* Product short name */}
          <div className="text-[10px] truncate text-slate-300 font-sans font-medium">
            {product.name.split('&')[0].trim()}
          </div>

          {/* Quick stock bar */}
          <div className="w-full bg-slate-900 rounded-full h-1 mt-1.5 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full rounded-full ${
                isLowStock ? 'bg-amber-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${product.stockPercent}%` }}
            />
          </div>

          {/* Hover hint */}
          <div className="text-[8px] text-cyan-300/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5">
            <Sparkles className="w-2 h-2" /> Inspect Details
          </div>
        </div>
      </Html>
    </group>
  );
};
