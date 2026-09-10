import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Truck } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface WasteCollectionVehicleProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const WasteCollectionVehicle: React.FC<WasteCollectionVehicleProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const truckRef = useRef<THREE.Group>(null);

  // Animate truck slowly traversing the perimeter loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    if (truckRef.current) {
      // Loop around the waste facility road: radius around 13m
      const radiusX = 14;
      const radiusZ = 12;
      const x = Math.sin(t) * radiusX;
      const z = Math.cos(t) * radiusZ;
      truckRef.current.position.x = x;
      truckRef.current.position.z = z;

      // Rotation facing the tangent
      const angle = Math.atan2(Math.cos(t) * radiusX, -Math.sin(t) * radiusZ);
      truckRef.current.rotation.y = angle;
    }
  });

  return (
    <group
      ref={truckRef}
      position={[14, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode({
          id: 'waste-truck-ev-01',
          name: 'Heavy Autonomous Electric Packer Truck (AERO-HAUL EV)',
          category: 'Fleet Logistics & Transport',
          status: 'optimal',
          efficiency: 98.8,
          powerKw: 45.0,
          description:
            'Zero-emission hydrogen-electric heavy compactor vehicle. Performs municipal sector routing, high-tonnage bin container pick-up, and autonomous yard unloading.',
          telemetryFields: [
            { label: 'Battery / Fuel Cell', value: '88% Hydrogen Buffer' },
            { label: 'Current Payload', value: '4.8 tons / 12 tons Max' },
            { label: 'Drive Mode', value: 'Autonomous Level 4 (Geofenced)' },
            { label: 'Fleet Route', value: 'Sector 3 Municipal Loop' },
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
      {/* 1. Main Truck Chassis */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.4, 6.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* 2. Driverless Aerodynamic Cab (Front) */}
      <group position={[0, 1.4, 2.2]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.5, 1.8]} />
          <meshStandardMaterial
            color={isNight ? '#0b1120' : '#1e293b'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Holographic Visor / Sensor Windshield */}
        <mesh position={[0, 0.25, 0.92]}>
          <planeGeometry args={[1.9, 0.6]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* LED Headlights */}
        <mesh position={[-0.8, -0.4, 0.92]}>
          <boxGeometry args={[0.35, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0.8, -0.4, 0.92]}>
          <boxGeometry args={[0.35, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* 3. High-Capacity Compactor Body (Rear) */}
      <mesh position={[0, 1.85, -0.9]} castShadow>
        <boxGeometry args={[2.3, 2.1, 4.2]} />
        <meshStandardMaterial
          color="#0284c7"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Solar Panel Array on Top of Compactor */}
      <mesh position={[0, 2.92, -0.9]}>
        <boxGeometry args={[2.2, 0.05, 4.0]} />
        <meshStandardMaterial color="#0369a1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Automated Side-Loader Arm Structure */}
      <mesh position={[-1.25, 1.5, 0.5]}>
        <boxGeometry args={[0.18, 1.2, 0.8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>

      {/* 6 Heavy Wheels with Cyan Glowing Hubcaps */}
      {[
        [-1.15, 0.5, 1.8],
        [-1.15, 0.5, -1.2],
        [-1.15, 0.5, -2.4],
        [1.15, 0.5, 1.8],
        [1.15, 0.5, -1.2],
        [1.15, 0.5, -2.4],
      ].map(([wx, wy, wz], wIdx) => (
        <group key={`truck-wheel-${wIdx}`} position={[wx, wy, wz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.48, 0.48, 0.35, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh position={[wx < 0 ? -0.19 : 0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <ringGeometry args={[0.12, 0.22, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* Floating Tag */}
      <Html position={[0, 3.6, 0]} center distanceFactor={9} className="pointer-events-none select-none">
        <div className="bg-slate-950/85 border border-sky-400/80 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-sky-200 flex items-center gap-1.5 shadow-lg">
          <Truck className="w-3 h-3 text-sky-400" />
          ELECTRIC PACKER TRUCK (AUTONOMOUS)
        </div>
      </Html>
    </group>
  );
};
