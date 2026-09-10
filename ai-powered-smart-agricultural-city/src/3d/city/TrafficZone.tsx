import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveZone } from './InteractiveZone';
import { Radio, Gauge } from 'lucide-react';

interface TrafficZoneProps {
  position?: [number, number, number];
  onSelect?: () => void;
}

export const TrafficZone: React.FC<TrafficZoneProps> = ({
  position = [0, 0, 0],
  onSelect,
}) => {
  // Traffic signal state cycle: 0: Green (N/S), 1: Yellow, 2: Red (N/S - E/W Green)
  const [signalPhase, setSignalPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalPhase((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const isNSGreen = signalPhase === 0;
  const isYellow = signalPhase === 1;
  const isEWGreen = signalPhase === 2;

  return (
    <InteractiveZone
      id="traffic"
      name="TRAFFIC MANAGEMENT"
      route="/zone/traffic"
      position={position}
      color="#38bdf8"
      statusText="Flow: Optimal"
      healthMetric="Speed: 46 km/h"
      subStatus="Signals AI-Synced"
      onSelect={onSelect}
      tooltipOffset={[0, 4.2, 0]}
    >
      {/* 1. Traffic Signal Gantries at 4 Intersection Corners */}
      {[
        [-2.8, -2.8, 0],
        [2.8, -2.8, Math.PI / 2],
        [2.8, 2.8, Math.PI],
        [-2.8, 2.8, -Math.PI / 2],
      ].map(([sx, sz, rot], idx) => (
        <group key={`signal-post-${idx}`} position={[sx, 0, sz]} rotation={[0, rot, 0]}>
          {/* Vertical Pole */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 3.6, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>

          {/* Cantilever Horizontal Arm */}
          <mesh position={[0.7, 3.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 1.6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>

          {/* Traffic Signal Box */}
          <group position={[1.3, 3.2, 0]}>
            <mesh>
              <boxGeometry args={[0.26, 0.75, 0.2]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
            {/* Red Light */}
            <mesh position={[0, 0.22, 0.11]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial
                color="#ef4444"
                transparent
                opacity={idx % 2 === 0 ? (isEWGreen ? 1 : 0.2) : isNSGreen ? 1 : 0.2}
              />
            </mesh>
            {/* Yellow Light */}
            <mesh position={[0, 0, 0.11]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial
                color="#f59e0b"
                transparent
                opacity={isYellow ? 1 : 0.2}
              />
            </mesh>
            {/* Green Light */}
            <mesh position={[0, -0.22, 0.11]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial
                color="#10b981"
                transparent
                opacity={idx % 2 === 0 ? (isNSGreen ? 1 : 0.2) : isEWGreen ? 1 : 0.2}
              />
            </mesh>
          </group>

          {/* Smart Traffic Camera */}
          <group position={[0.6, 3.6, 0.1]}>
            <mesh rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.1, 0.08, 0.2]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.02, 0.11]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        </group>
      ))}

      {/* 2. Overhead Digital Traffic Monitoring Screen (Suspended Gantry across North Arm) */}
      <group position={[0, 3.6, -3.8]}>
        {/* Support Portal Frame */}
        <mesh position={[-2.7, -1.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 3.6, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[2.7, -1.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 3.6, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Horizontal Gantry Truss */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.6, 0.18, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Digital LED Screen Display */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[4.2, 0.7, 0.12]} />
          <meshStandardMaterial color="#050e14" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.4, 0.07]}>
          <planeGeometry args={[4.0, 0.58]} />
          <meshStandardMaterial color="#042f2e" emissive="#0d9488" emissiveIntensity={0.4} />
        </mesh>

        {/* 3D HTML Content on Monitoring Screen */}
        <Html position={[0, -0.4, 0.12]} center distanceFactor={20}>
          <div className="flex items-center gap-3 px-2 py-0.5 rounded bg-slate-950/90 text-[9px] font-mono text-emerald-400 select-none border border-emerald-500/30 whitespace-nowrap shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>AI TRAFFIC RADAR &bull; SPEED: 46 KM/H &bull; OPTIMAL</span>
          </div>
        </Html>
      </group>
    </InteractiveZone>
  );
};
