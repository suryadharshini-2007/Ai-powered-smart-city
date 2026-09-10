import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { MARKET_PRODUCTS } from './MarketData';
import { ProductDetail } from './MarketTypes';
import { HolographicPriceTag } from './HolographicPriceDisplays';

interface DigitalShelvesProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  onSelectProduct: (product: ProductDetail) => void;
  isNight?: boolean;
}

export const DigitalShelves: React.FC<DigitalShelvesProps> = ({
  onSelectNode,
  onSelectProduct,
  isNight = false,
}) => {
  const mistRef = useRef<THREE.Points>(null);
  const wheatAlertRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle breathing/pulsing for produce ultrasonic mist
    if (mistRef.current) {
      mistRef.current.rotation.y = t * 0.2;
      mistRef.current.position.y = 1.6 + Math.sin(t * 3) * 0.05;
    }

    // Blinking red/amber warning for low-stock wheat
    if (wheatAlertRef.current) {
      const mat = wheatAlertRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.0 + Math.sin(t * 6) * 1.5;
      }
    }
  });

  const handleProductNodeClick = (product: ProductDetail) => {
    onSelectProduct(product);
    onSelectNode({
      id: product.id,
      name: product.name,
      category: 'Smart Inventory & Agro-Produce',
      status: product.stockStatus === 'Low Stock' ? 'warning' : 'optimal',
      efficiency: product.stockPercent,
      powerKw: 1.2,
      description: `${product.recommendation} | Origin: ${product.origin} | Organic: ${product.organicStatus}`,
      telemetryFields: [
        { label: 'Market Price', value: product.displayPrice },
        { label: 'Inventory Stock', value: product.stock },
        { label: 'Origin Farm', value: product.origin },
        { label: 'Organic Grade', value: product.organicStatus },
        { label: 'Traceability Hash', value: product.traceabilityHash },
        { label: 'Harvest Freshness', value: product.harvestDate },
      ],
    });
  };

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. RICE SECTION (AISLE 1 - WEST AISLE) */}
      {/* ========================================================= */}
      <group
        position={[-7.5, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          handleProductNodeClick(MARKET_PRODUCTS.rice);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Modular Metallic Shelf Unit */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.2, 6.5]} />
          <meshStandardMaterial
            color={isNight ? '#0f172a' : '#1e293b'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Shelf Shelving Tiers (3 horizontal decks) */}
        {[-0.8, 0, 0.8].map((yOffset, idx) => (
          <group key={`rice-tier-${idx}`} position={[0, 1.6 + yOffset, 0]}>
            {/* Illuminated Front Edge Neon Strip */}
            <mesh position={[1.62, 0, 0]}>
              <boxGeometry args={[0.06, 0.08, 6.4]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={2}
              />
            </mesh>
            {/* Grain Sacks & Storage Bins */}
            {[-2.2, -1.1, 0, 1.1, 2.2].map((zOffset, bIdx) => (
              <group key={`rice-sack-${idx}-${bIdx}`} position={[0.6, 0.3, zOffset]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.35, 0.42, 0.55, 12]} />
                  <meshStandardMaterial color="#fef3c7" roughness={0.9} />
                </mesh>
                {/* Organic Green Seal Label */}
                <mesh position={[0.36, 0.05, 0]} rotation={[0, 0, -Math.PI / 12]}>
                  <planeGeometry args={[0.2, 0.25]} />
                  <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Overhead Digital Header Display */}
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[3.3, 0.4, 6.6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>

        {/* Floating Holographic Price Tag for Rice */}
        <HolographicPriceTag
          position={[0, 4.2, 0]}
          product={MARKET_PRODUCTS.rice}
          onSelect={handleProductNodeClick}
          highlightColor="#38bdf8"
          glowOffset={0}
        />

        {/* Digital Inventory Indicator Sign */}
        <Html position={[1.7, 3.1, 0]} transform rotation={[0, Math.PI / 2, 0]} distanceFactor={7}>
          <div className="bg-sky-950/90 border border-sky-400 px-3 py-1 rounded-lg text-center shadow-lg font-mono pointer-events-none select-none">
            <div className="text-[10px] text-sky-300 font-bold tracking-wider">RICE AISLE</div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Available &bull; 85% Stock
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 2. VEGETABLES SECTION (AISLE 2 - EAST AISLE) */}
      {/* ========================================================= */}
      <group
        position={[7.5, 0, -3.2]}
        onClick={(e) => {
          e.stopPropagation();
          handleProductNodeClick(MARKET_PRODUCTS.vegetables);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Tiered Vegetable Stand */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.8, 5.0]} />
          <meshStandardMaterial
            color={isNight ? '#0f172a' : '#1e293b'}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Wooden & Metal Slanted Produce Crates */}
        {[-1.5, 0, 1.5].map((zOffset, cIdx) => (
          <group key={`veg-crate-${cIdx}`} position={[-0.4, 1.8, zOffset]} rotation={[0, 0, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[1.4, 0.45, 1.3]} />
              <meshStandardMaterial color="#854d0e" roughness={0.8} />
            </mesh>
            {/* Crisp Greens / Cabbages / Broccoli */}
            {[-0.3, 0.3].map((vx, vi) => (
              <mesh key={`veg-ball-${cIdx}-${vi}`} position={[vx, 0.35, 0]} castShadow>
                <sphereGeometry args={[0.26, 8, 8]} />
                <meshStandardMaterial
                  color={cIdx === 0 ? '#15803d' : cIdx === 1 ? '#16a34a' : '#22c55e'}
                  roughness={0.6}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Ultrasonic Water Fog / Mist Emitter Pipe */}
        <mesh position={[-1.2, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 4.8, 8]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>

        {/* Floating Holographic Price Tag for Vegetables */}
        <HolographicPriceTag
          position={[0, 3.8, 0]}
          product={MARKET_PRODUCTS.vegetables}
          onSelect={handleProductNodeClick}
          highlightColor="#22c55e"
          glowOffset={1.5}
        />

        {/* Digital Inventory Indicator Sign */}
        <Html position={[-1.7, 2.8, 0]} transform rotation={[0, -Math.PI / 2, 0]} distanceFactor={7}>
          <div className="bg-emerald-950/90 border border-emerald-400 px-3 py-1 rounded-lg text-center shadow-lg font-mono pointer-events-none select-none">
            <div className="text-[10px] text-emerald-300 font-bold tracking-wider">ORGANIC GREENS</div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Available &bull; 78% Stock
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 3. TOMATO SECTION (VINE-RIPENED HYDROPONIC PRODUCE ISLAND) */}
      {/* ========================================================= */}
      <group
        position={[7.5, 0, 3.2]}
        onClick={(e) => {
          e.stopPropagation();
          handleProductNodeClick(MARKET_PRODUCTS.tomato);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Display Island Base */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.8, 4.5]} />
          <meshStandardMaterial
            color={isNight ? '#0f172a' : '#1e293b'}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Slanted Tomato Bins with glossy red tomatoes */}
        {[-1.2, 0.4].map((zOffset, tIdx) => (
          <group key={`tom-crate-${tIdx}`} position={[-0.4, 1.8, zOffset]} rotation={[0, 0, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[1.4, 0.4, 1.2]} />
              <meshStandardMaterial color="#854d0e" roughness={0.8} />
            </mesh>
            {/* Cluster of bright red glossy tomatoes */}
            {[-0.3, 0.3].map((tx, ti) => (
              <mesh key={`tom-sphere-${tIdx}-${ti}`} position={[tx, 0.3, 0]} castShadow>
                <sphereGeometry args={[0.22, 12, 12]} />
                <meshStandardMaterial
                  color="#dc2626"
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Floating Holographic Price Tag for Tomato */}
        <HolographicPriceTag
          position={[0, 3.8, 0]}
          product={MARKET_PRODUCTS.tomato}
          onSelect={handleProductNodeClick}
          highlightColor="#ef4444"
          glowOffset={2.8}
        />

        {/* Digital Inventory Indicator Sign */}
        <Html position={[-1.7, 2.8, 0]} transform rotation={[0, -Math.PI / 2, 0]} distanceFactor={7}>
          <div className="bg-red-950/90 border border-red-400 px-3 py-1 rounded-lg text-center shadow-lg font-mono pointer-events-none select-none">
            <div className="text-[10px] text-red-300 font-bold tracking-wider">HYDROPONIC TOMATOES</div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Available &bull; 92% Stock
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 4. WHEAT SECTION (GOLDEN GRAIN SILOS & LOW STOCK ALERT) */}
      {/* ========================================================= */}
      <group
        position={[0, 0, -8.5]}
        onClick={(e) => {
          e.stopPropagation();
          handleProductNodeClick(MARKET_PRODUCTS.wheat);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Wheat Silo Base Stand */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <boxGeometry args={[7.2, 1.0, 3.2]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>

        {/* 3 Golden Grain Dispensing Silos */}
        {[-2.2, 0, 2.2].map((sx, sIdx) => (
          <group key={`wheat-silo-${sIdx}`} position={[sx, 2.6, 0]}>
            {/* Silo Cylinder */}
            <mesh castShadow>
              <cylinderGeometry args={[0.85, 0.85, 3.2, 16]} />
              <meshStandardMaterial
                color="#d97706"
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
            {/* Transparent Glass Level Viewing Window */}
            <mesh position={[0, 0, 0.86]}>
              <planeGeometry args={[0.3, 2.4]} />
              <meshStandardMaterial
                color="#fef08a"
                transparent
                opacity={0.7}
                emissive="#f59e0b"
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* Bottom Funnel Chute */}
            <mesh position={[0, -1.8, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.85, 0.8, 16]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Flashing "LOW STOCK" Warning Light on Wheat Silo */}
        <mesh ref={wheatAlertRef} position={[0, 4.6, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.35, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.5}
          />
        </mesh>

        {/* Floating Holographic Price Tag for Wheat */}
        <HolographicPriceTag
          position={[0, 5.4, 0]}
          product={MARKET_PRODUCTS.wheat}
          onSelect={handleProductNodeClick}
          highlightColor="#f59e0b"
          glowOffset={3.5}
        />

        {/* Digital Inventory Indicator Sign with LOW STOCK Warning */}
        <Html position={[0, 3.8, 1.2]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-amber-950/95 border-2 border-amber-500 px-3.5 py-1.5 rounded-xl text-center shadow-[0_0_25px_rgba(245,158,11,0.6)] font-mono">
            <div className="text-[10px] text-amber-300 font-bold tracking-wider">WHOLE GRAIN WHEAT</div>
            <div className="text-[11px] text-amber-400 font-extrabold flex items-center justify-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Low Stock &bull; 14% Remaining
            </div>
            <div className="text-[8px] text-slate-300 mt-0.5">
              Automated Restock Drone #DR-04 En Route
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
