import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Compass,
  Activity,
  Cpu,
  Wifi,
  Navigation,
  Car,
  Footprints,
  Radio,
  Sparkles,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { RoadInfrastructureData } from './InfrastructureTypes';
import { infraSounds } from './InfrastructureSounds';

interface SmartRoadAndTrafficProps {
  roadData: RoadInfrastructureData;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  onVehiclePositionsUpdate?: (positions: [number, number, number][]) => void;
  onPedestrianPositionsUpdate?: (positions: [number, number, number][]) => void;
  isNight?: boolean;
}

export const SmartRoadAndTraffic: React.FC<SmartRoadAndTrafficProps> = ({
  roadData,
  onSelectNode,
  onVehiclePositionsUpdate,
  onPedestrianPositionsUpdate,
  isNight = false,
}) => {
  // Autonomous vehicles refs
  const car1Ref = useRef<THREE.Group>(null);
  const car2Ref = useRef<THREE.Group>(null);
  const car3Ref = useRef<THREE.Group>(null);

  // Pedestrians refs
  const ped1Ref = useRef<THREE.Group>(null);
  const ped2Ref = useRef<THREE.Group>(null);

  // Piezoelectric sensor glow ref
  const piezoRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Vehicles cruising along lanes
    // Lane 1 (Going East -> West, z = 1.6)
    const v1X = ((t * 4.2) % 36) - 18;
    if (car1Ref.current) {
      car1Ref.current.position.set(v1X, 0, 1.6);
      car1Ref.current.rotation.y = Math.PI / 2;
    }

    // Lane 2 (Going West -> East, z = -1.6)
    const v2X = 18 - ((t * 3.8) % 36);
    if (car2Ref.current) {
      car2Ref.current.position.set(v2X, 0, -1.6);
      car2Ref.current.rotation.y = -Math.PI / 2;
    }

    // Autonomous Delivery Pod (Lane 1, offset)
    const v3X = (((t * 2.8) + 12) % 36) - 18;
    if (car3Ref.current) {
      car3Ref.current.position.set(v3X, 0, 1.6);
      car3Ref.current.rotation.y = Math.PI / 2;
    }

    // 2. Pedestrians strolling along sidewalk (z = 4.2)
    const p1X = ((t * 1.2) % 24) - 12;
    if (ped1Ref.current) {
      ped1Ref.current.position.set(p1X, 0, 4.2);
      ped1Ref.current.rotation.y = Math.PI / 2;
    }

    // Pedestrian strolling in opposite direction (z = 4.8)
    const p2X = 10 - ((t * 1.1) % 22);
    if (ped2Ref.current) {
      ped2Ref.current.position.set(p2X, 0, 4.8);
      ped2Ref.current.rotation.y = -Math.PI / 2;
    }

    // Report positions to parent for Streetlight auto-brightness detection
    if (onVehiclePositionsUpdate) {
      onVehiclePositionsUpdate([
        [v1X, 0, 1.6],
        [v2X, 0, -1.6],
        [v3X, 0, 1.6],
      ]);
    }
    if (onPedestrianPositionsUpdate) {
      onPedestrianPositionsUpdate([
        [p1X, 0, 4.2],
        [p2X, 0, 4.8],
      ]);
    }

    // Piezoelectric sensor subtle pulse
    if (piezoRef.current) {
      piezoRef.current.children.forEach((mesh, idx) => {
        const pMat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (pMat) {
          pMat.opacity = 0.3 + Math.sin(t * 3 + idx * 0.5) * 0.25;
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. MAIN ROAD ARTERY SURFACE */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          infraSounds.playClick();
          onSelectNode({
            id: 'infra-smart-road-segment',
            name: 'Cellular V2X Piezoelectric Smart Road Artery',
            category: 'Smart Transport & Road Infrastructure',
            status: 'optimal',
            efficiency: roadData.roadHealthPercent,
            powerKw: roadData.piezoelectricGenerationKw,
            description:
              'High-durability porous asphalt highway equipped with embedded dynamic inductive wireless power transfer coils, continuous acoustic load strain gauges, and sub-millimeter piezoelectric energy harvesters.',
            telemetryFields: [
              { label: 'Traffic Condition', value: roadData.trafficCondition },
              { label: 'Structural Road Health', value: `${roadData.roadHealthPercent}% Nominal` },
              { label: 'Active Sensors', value: `${roadData.smartSensorsCount} Nodes (Strain, Temp, Friction)` },
              { label: 'Communication Status', value: roadData.communicationStatus },
              { label: 'Fleet Average Velocity', value: `${roadData.averageSpeedKmH} km/h` },
              { label: 'Piezoelectric Output', value: `${roadData.piezoelectricGenerationKw} kW (Kinetic Harvest)` },
              { label: 'Wireless Inductive Lane', value: 'Active (50 kW In-Motion Charging)' },
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
        {/* Asphalt Highway Deck */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[36, 0.1, 7.2]} />
          <meshStandardMaterial
            color={isNight ? '#070a13' : '#0f172a'}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Center Dashed Autonomous Lane Divider (Glowing cyan) */}
        {[-15, -10, -5, 0, 5, 10, 15].map((dx, dIdx) => (
          <mesh key={`lane-mark-${dIdx}`} position={[dx, 0.11, 0]}>
            <planeGeometry args={[2.5, 0.18]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.8}
            />
          </mesh>
        ))}

        {/* Outer Continuous Road Border Lines */}
        <mesh position={[0, 0.11, 3.4]}>
          <planeGeometry args={[36, 0.14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.11, -3.4]}>
          <planeGeometry args={[36, 0.14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Embedded Inductive Dynamic Wireless Charging Track (Coil Rings in Asphalt) */}
        {[-14, -7, 0, 7, 14].map((ix, iIdx) => (
          <mesh key={`inductive-${iIdx}`} position={[ix, 0.11, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 0.85, 24]} />
            <meshBasicMaterial color="#0d9488" transparent opacity={0.6} />
          </mesh>
        ))}

        {/* Embedded Piezoelectric Grid Sensors (Blinking amber/cyan dots) */}
        <group ref={piezoRef} position={[0, 0.11, 0]}>
          {[-12, -6, 2, 8, 13].map((px, pIdx) => (
            <mesh key={`piezo-${pIdx}`} position={[px, 0, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.2, 12]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>

        {/* Smart Pedestrian Crosswalk with Active LED Studs */}
        <group position={[0, 0.11, 0]}>
          {[-3.0, -2.0, -1.0, 0, 1.0, 2.0, 3.0].map((cz, cIdx) => (
            <mesh key={`crosswalk-${cIdx}`} position={[0, 0, cz]}>
              <planeGeometry args={[2.2, 0.5]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================= */}
      {/* 2. PEDESTRIAN PATHWAYS & KINETIC PAVEMENT */}
      {/* ========================================================= */}
      <group position={[0, 0.08, 4.6]}>
        {/* Sidewalk Slab */}
        <mesh receiveShadow>
          <boxGeometry args={[36, 0.12, 2.0]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Kinetic Pavement Tiles */}
        {[-12, -6, 0, 6, 12].map((kx, kIdx) => (
          <mesh key={`kinetic-${kIdx}`} position={[kx, 0.07, 0]}>
            <boxGeometry args={[1.4, 0.02, 1.4]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ========================================================= */}
      {/* 3. ANIMATED CONNECTED AUTONOMOUS VEHICLES */}
      {/* ========================================================= */}
      {/* Autonomous Passenger EV (Lane 1) */}
      <group ref={car1Ref} position={[-8, 0, 1.6]}>
        {/* Car Body */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.5, 0.55, 3.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Cabin Glass */}
        <mesh position={[0, 0.8, -0.1]} castShadow>
          <boxGeometry args={[1.2, 0.42, 1.8]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
        {/* Headlights & Taillights */}
        <mesh position={[0, 0.45, 1.61]}>
          <planeGeometry args={[1.2, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.45, -1.61]}>
          <planeGeometry args={[1.2, 0.15]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Autonomous Lidar Dome on Roof */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Autonomous Fastback Sedan (Lane 2) */}
      <group ref={car2Ref} position={[6, 0, -1.6]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.5, 0.55, 3.3]} />
          <meshStandardMaterial color="#0d9488" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.8, -0.1]} castShadow>
          <boxGeometry args={[1.2, 0.42, 1.9]} />
          <meshStandardMaterial color="#5eead4" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 1.66]}>
          <planeGeometry args={[1.2, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.45, -1.66]}>
          <planeGeometry args={[1.2, 0.15]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Autonomous Delivery Pod (Lane 1, offset) */}
      <group ref={car3Ref} position={[12, 0, 1.6]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[1.3, 1.0, 2.2]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 1.11]}>
          <planeGeometry args={[1.0, 0.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 4. ANIMATED PEDESTRIANS ON SIDEWALK */}
      {/* ========================================================= */}
      {/* Pedestrian 1 */}
      <group ref={ped1Ref} position={[-6, 0, 4.2]}>
        {/* Torso */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.6, 8, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Pedestrian 2 */}
      <group ref={ped2Ref} position={[4, 0, 4.8]}>
        <mesh position={[0, 0.85, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.6, 8, 8]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
      </group>
    </group>
  );
};
