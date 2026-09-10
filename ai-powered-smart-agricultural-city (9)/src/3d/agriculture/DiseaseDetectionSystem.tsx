import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AlertTriangle, ShieldAlert, CheckCircle2, ScanLine } from 'lucide-react';

interface DiseaseDetectionSystemProps {
  position: [number, number, number];
  isSelected?: boolean;
  isScanning?: boolean;
  onClick: () => void;
}

export const DiseaseDetectionSystem: React.FC<DiseaseDetectionSystemProps> = ({
  position,
  isSelected = false,
  isScanning = false,
  onClick,
}) => {
  const scanRingRef = useRef<THREE.Mesh>(null);
  const scanLaserRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (scanRingRef.current) {
      scanRingRef.current.rotation.z += 0.02;
    }
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 3) * 0.4;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Visual Bounding Grid over the Affected Plant Sector */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.8, 1.0, 2.2]} />
        <meshBasicMaterial
          color="#ef4444"
          wireframe
          transparent
          opacity={isSelected || isScanning ? 0.8 : 0.3}
        />
      </mesh>

      {/* Laser Scanning Plane */}
      <mesh ref={scanLaserRef} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 2.1]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ground Warning / Inspection Marker */}
      <mesh ref={scanRingRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={isSelected ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Alert Beacon */}
      <Html position={[0, 1.4, 0]} center distanceFactor={18}>
        <div
          className={`px-3 py-1.5 rounded-xl border backdrop-blur-xl transition-all cursor-pointer select-none shadow-xl flex items-center gap-2 ${
            isSelected
              ? 'bg-red-950/95 border-red-500 text-white scale-110 shadow-red-500/40'
              : 'bg-slate-950/85 border-red-500/70 text-red-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <div className="text-left font-mono">
            <div className="text-[10px] font-bold text-red-400 font-heading">
              AI PATHOLOGY ALERT
            </div>
            <div className="text-[9px] text-slate-300">
              Sector 3B &bull; Leaf Blight Detected (94%)
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
