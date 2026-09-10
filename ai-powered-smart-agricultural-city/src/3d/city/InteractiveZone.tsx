import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowUpRight, Activity } from 'lucide-react';

export interface InteractiveZoneProps {
  id: 'agriculture' | 'traffic' | 'school' | 'market' | 'waste' | 'infrastructure';
  name: string;
  route: string;
  position: [number, number, number];
  color: string;
  statusText: string;
  subStatus?: string;
  healthMetric?: string;
  children: React.ReactNode;
  onSelect?: () => void;
  tooltipOffset?: [number, number, number];
}

export const InteractiveZone: React.FC<InteractiveZoneProps> = ({
  id,
  name,
  route,
  position,
  color,
  statusText,
  subStatus,
  healthMetric,
  children,
  onSelect,
  tooltipOffset = [0, 5, 0],
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) onSelect();
    navigate(route);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 3D Geometry of the zone passed as children */}
      {children}

      {/* Ground Foundation Glow & Boundary Ring when hovered */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.2, 6.7, 36]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.85 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle area ground fill glow when hovered */}
      {hovered && (
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6.2, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} />
        </mesh>
      )}

      {/* Pulsing Hover Accent Point Light */}
      {hovered && (
        <pointLight
          position={[0, 3, 0]}
          color={color}
          intensity={3}
          distance={10}
        />
      )}

      {/* 3D Tooltip & Status Card on Hover */}
      <Html
        position={tooltipOffset}
        center
        distanceFactor={22}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={handleClick}
          className={`cursor-pointer select-none transition-all duration-300 transform ${
            hovered ? 'scale-105 opacity-100 -translate-y-1' : 'scale-95 opacity-85 hover:opacity-100'
          }`}
        >
          <div
            className="px-3.5 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border shadow-xl flex items-center gap-3 whitespace-nowrap transition-colors"
            style={{
              borderColor: hovered ? color : 'rgba(51, 65, 85, 0.8)',
              boxShadow: hovered ? `0 0 25px ${color}40` : undefined,
            }}
          >
            {/* Pulsing Status Dot */}
            <span
              className="w-3 h-3 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: color }}
            />

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-heading font-extrabold uppercase tracking-wide text-white">
                  {name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="text-[10px] font-mono text-slate-300 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-emerald-400">{statusText}</span>
                {healthMetric && (
                  <>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-sky-300">{healthMetric}</span>
                  </>
                )}
                {subStatus && (
                  <>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-slate-400">{subStatus}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
