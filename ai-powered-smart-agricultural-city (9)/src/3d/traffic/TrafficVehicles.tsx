import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { TrafficStateMode, AccidentTelemetry, InflatableBarrierState } from './TrafficTypes';

interface TrafficVehiclesProps {
  trafficState: TrafficStateMode;
  accidentState?: AccidentTelemetry;
  barrierState?: InflatableBarrierState;
  nsLightState: 'RED' | 'YELLOW' | 'GREEN';
  ewLightState: 'RED' | 'YELLOW' | 'GREEN';
  pedestriansCrossing: boolean;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const TrafficVehicles: React.FC<TrafficVehiclesProps> = ({
  trafficState,
  accidentState,
  barrierState,
  nsLightState,
  ewLightState,
  pedestriansCrossing,
  onSelectNode,
  isNight = false,
}) => {
  // Vehicle positions along axes
  // NS Southbound vehicle (moving -z to +z: x = -3.5)
  const carNS1 = useRef<THREE.Group>(null);
  const posNS1 = useRef(-38);

  // NS Southbound fast vehicle (x = -1.8)
  const carNS2 = useRef<THREE.Group>(null);
  const posNS2 = useRef(-25);

  // NS Northbound vehicle (moving +z to -z: x = 3.5)
  const carNS3 = useRef<THREE.Group>(null);
  const posNS3 = useRef(38);

  // EW Eastbound vehicle (moving -x to +x: z = 3.5)
  const busEW = useRef<THREE.Group>(null);
  const posBusEW = useRef(-40);

  // EW Westbound truck (moving +x to -x: z = -3.5)
  const truckEW = useRef<THREE.Group>(null);
  const posTruckEW = useRef(40);

  // Motorcycle (moving along EW or NS)
  const motoRef = useRef<THREE.Group>(null);
  const posMoto = useRef(-30);

  // Ambulance (deployed from SE Hospital or cruising)
  const ambulanceRef = useRef<THREE.Group>(null);
  const posAmbulance = useRef(-42);

  // Errant vehicle for inflatable barrier simulation
  const rogueCarRef = useRef<THREE.Group>(null);
  const roguePos = useRef(new THREE.Vector3(3.5, 0.35, -20));

  // Accident collided cars
  const crashCar1Ref = useRef<THREE.Group>(null);
  const crashCar2Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Determine speed multipliers
    const baseSpeed = trafficState === 'CONGESTION' ? 3.5 : 12.0;

    // Helper for vehicle stop line checks (Stop lines are at ~ ±12m)
    // 1. Southbound Car 1 (x = -3.5, moving z: -45 -> +45)
    if (carNS1.current) {
      const mustStop =
        (nsLightState === 'RED' || pedestriansCrossing || trafficState === 'ACCIDENT') &&
        posNS1.current < -12.5 &&
        posNS1.current > -17.0;

      if (!mustStop) {
        posNS1.current += delta * baseSpeed;
        if (posNS1.current > 45) posNS1.current = -45;
      }
      carNS1.current.position.set(-3.5, 0.4, posNS1.current);
    }

    // 2. Southbound Car 2 (x = -1.8, moving z: -45 -> +45)
    if (carNS2.current) {
      const mustStop =
        (nsLightState === 'RED' || pedestriansCrossing || trafficState === 'ACCIDENT') &&
        posNS2.current < -12.5 &&
        posNS2.current > -18.0;

      const speed = trafficState === 'OVERSPEED' ? 24.0 : baseSpeed * 1.15;

      if (!mustStop) {
        posNS2.current += delta * speed;
        if (posNS2.current > 45) posNS2.current = -45;
      }
      carNS2.current.position.set(-1.8, 0.4, posNS2.current);
    }

    // 3. Northbound Car 3 (x = 3.5, moving z: +45 -> -45)
    if (carNS3.current) {
      const mustStop =
        (nsLightState === 'RED' || pedestriansCrossing || trafficState === 'ACCIDENT') &&
        posNS3.current > 12.5 &&
        posNS3.current < 17.5;

      if (!mustStop) {
        posNS3.current -= delta * baseSpeed;
        if (posNS3.current < -45) posNS3.current = 45;
      }
      carNS3.current.position.set(3.5, 0.4, posNS3.current);
    }

    // 4. City Transit EV Bus (EW: moving x: -45 -> +45, z = 3.5)
    if (busEW.current) {
      const mustStop =
        (ewLightState === 'RED' || trafficState === 'ACCIDENT') &&
        posBusEW.current < -13.0 &&
        posBusEW.current > -18.0;

      if (!mustStop) {
        posBusEW.current += delta * (baseSpeed * 0.85);
        if (posBusEW.current > 45) posBusEW.current = -45;
      }
      busEW.current.position.set(posBusEW.current, 0.7, 3.5);
    }

    // 5. Heavy Logistics Truck (EW: moving x: +45 -> -45, z = -3.5)
    if (truckEW.current) {
      const mustStop =
        (ewLightState === 'RED' || trafficState === 'ACCIDENT') &&
        posTruckEW.current > 13.0 &&
        posTruckEW.current < 18.0;

      if (!mustStop) {
        posTruckEW.current -= delta * (baseSpeed * 0.8);
        if (posTruckEW.current < -45) posTruckEW.current = 45;
      }
      truckEW.current.position.set(posTruckEW.current, 0.8, -3.5);
    }

    // 6. Motorcycle / Scooter (moving x: -45 -> +45, z = 1.8)
    if (motoRef.current) {
      const mustStop =
        trafficState !== 'RED_LIGHT_VIOLATION' &&
        ewLightState === 'RED' &&
        posMoto.current < -12.5 &&
        posMoto.current > -16.5;

      const motoSpeed = trafficState === 'RED_LIGHT_VIOLATION' ? 18.0 : baseSpeed * 1.1;

      if (!mustStop) {
        posMoto.current += delta * motoSpeed;
        if (posMoto.current > 45) posMoto.current = -45;
      }
      motoRef.current.position.set(posMoto.current, 0.35, 1.8);
    }

    // 7. Ambulance Dispatch Movement
    if (ambulanceRef.current) {
      if (accidentState?.detected || trafficState === 'ACCIDENT') {
        // Ambulance speeds into junction from East Corridor towards Central Junction
        posAmbulance.current += delta * 15.0;
        if (posAmbulance.current > 7.5) {
          posAmbulance.current = 7.5; // Arrives at scene
        }
      } else {
        posAmbulance.current = -42; // Staged at bay
      }
      ambulanceRef.current.position.set(posAmbulance.current, 0.6, -1.8);
    }

    // 8. Rogue Errant Car for Inflatable Barrier Simulation
    if (rogueCarRef.current) {
      if (trafficState === 'DANGEROUS_VEHICLE' || barrierState?.impactRisk) {
        // Moves from north southbound and violently veers toward SE curb (8.5, 0, 10.5)
        if (roguePos.current.z < 8.0) {
          roguePos.current.z += delta * 14.0;
          roguePos.current.x += delta * 7.5;
        } else {
          // Impacted and stopped by barrier at (7.6, 0.35, 9.8)
          roguePos.current.set(7.6, 0.35, 9.8);
          rogueCarRef.current.rotation.y = 0.6;
        }
        rogueCarRef.current.position.copy(roguePos.current);
      } else {
        roguePos.current.set(3.5, 0.35, -25);
        rogueCarRef.current.position.copy(roguePos.current);
        rogueCarRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group>
      {/* 1. SEDAN EV 01 (Southbound, Blue) */}
      <group
        ref={carNS1}
        position={[-3.5, 0.4, -38]}
        rotation={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'ev-sedan-tn01',
            name: 'Autonomous Electric Sedan #TN-01',
            category: 'Smart Mobility Fleet',
            status: 'optimal',
            efficiency: 99.1,
            description: 'V2X Level-4 autonomous passenger electric sedan with continuous telemetry sync to municipal traffic orchestration platform.',
            telemetryFields: [
              { label: 'Plate', value: 'TN 01 AK 9012' },
              { label: 'Speed', value: `${trafficState === 'CONGESTION' ? '12' : '42'} km/h` },
              { label: 'Battery Level', value: '74%' },
              { label: 'V2X Connectivity', value: '5G Low-Latency' },
            ],
          });
        }}
      >
        {/* Car Body */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.7, 3.8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cabin Glass */}
        <mesh position={[0, 0.48, -0.2]}>
          <boxGeometry args={[1.5, 0.55, 2.0]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.6, 0, 1.91]}>
          <boxGeometry args={[0.35, 0.15, 0.05]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.6, 0, 1.91]}>
          <boxGeometry args={[0.35, 0.15, 0.05]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
        {/* Taillights */}
        <mesh position={[0, 0, -1.91]}>
          <boxGeometry args={[1.6, 0.12, 0.05]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
        </mesh>
        {/* Wheels */}
        {[-0.9, 0.9].map((x) =>
          [-1.2, 1.2].map((z) => (
            <mesh key={`w1-${x}-${z}`} position={[x, -0.2, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.25, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* 2. FAST SEDAN EV 02 (Southbound Fast Lane, Emerald or Speeding Red) */}
      <group
        ref={carNS2}
        position={[-1.8, 0.4, -25]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'ev-sedan-tn74',
            name: 'High-Performance Electric Sedan (TN 74 AE 8819)',
            category: 'Smart Mobility Fleet',
            status: trafficState === 'OVERSPEED' ? 'warning' : 'optimal',
            efficiency: 97.4,
            description: 'Sport EV tracked by roadside radar. Subject to dynamic automated overspeed speed-trap recording.',
            telemetryFields: [
              { label: 'Plate', value: 'TN 74 AE 8819' },
              { label: 'Speed', value: `${trafficState === 'OVERSPEED' ? '86 km/h (VIOLATION)' : '46 km/h'}` },
              { label: 'Speed Trap', value: trafficState === 'OVERSPEED' ? 'RADAR TRIGGERED' : 'NORMAL' },
            ],
          });
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.65, 3.6]} />
          <meshStandardMaterial
            color={trafficState === 'OVERSPEED' ? '#ef4444' : '#10b981'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.44, -0.1]}>
          <boxGeometry args={[1.4, 0.5, 1.9]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.55, 0, 1.81]}>
          <boxGeometry args={[0.3, 0.12, 0.05]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.55, 0, 1.81]}>
          <boxGeometry args={[0.3, 0.12, 0.05]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* 3. SUV EV 03 (Northbound, Amber) */}
      <group
        ref={carNS3}
        position={[3.5, 0.4, 38]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'ev-suv-tn09',
            name: 'Civic Autonomous SUV #TN-09',
            category: 'Smart Mobility Fleet',
            status: 'optimal',
            efficiency: 98.4,
            description: 'All-wheel electric crossover operating in municipal autonomous ride-share pool.',
            telemetryFields: [
              { label: 'Plate', value: 'TN 09 KL 4421' },
              { label: 'Speed', value: '38 km/h' },
              { label: 'Passenger Load', value: '3 / 5' },
            ],
          });
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.9, 0.8, 4.0]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.55, -0.1]}>
          <boxGeometry args={[1.6, 0.6, 2.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, 0, 2.01]}>
          <boxGeometry args={[0.35, 0.15, 0.05]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.6, 0, 2.01]}>
          <boxGeometry args={[0.35, 0.15, 0.05]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* 4. PUBLIC TRANSIT EV BUS (East-West Eastbound) */}
      <group
        ref={busEW}
        position={[-40, 0.7, 3.5]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'smart-city-ev-bus-04',
            name: 'Smart Transit Autonomous Electric Bus (Line 14)',
            category: 'Public Mass Transit',
            status: 'optimal',
            efficiency: 99.2,
            powerKw: 95.0,
            description: 'Zero-emission high-capacity autonomous transit cruiser with real-time passenger occupancy monitoring and priority intersection green-wave routing.',
            telemetryFields: [
              { label: 'Route', value: 'Line 14 • Metro Link' },
              { label: 'Passenger Load', value: '38 / 50' },
              { label: 'Battery Charge', value: '81%' },
              { label: 'Next Stop', value: 'Central Plaza (300m)' },
            ],
          });
        }}
      >
        {/* Bus Body */}
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.8, 8.4]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Panoramic Glass Window Band */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.45, 0.75, 7.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Destination Headboard Display */}
        <mesh position={[0, 0.78, 4.21]}>
          <planeGeometry args={[1.8, 0.25]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={2} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.8, -0.4, 4.21]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 12]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.8, -0.4, 4.21]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 12]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* 5. COMMERCIAL LOGISTICS TRUCK (East-West Westbound) */}
      <group
        ref={truckEW}
        position={[40, 0.8, -3.5]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'ev-freight-truck-77',
            name: 'Electric Heavy Cargo Logistics Hauler',
            category: 'Freight & Supply Chain',
            status: 'optimal',
            efficiency: 97.6,
            powerKw: 120.0,
            description: 'Automated electric urban delivery truck hauling containerized fresh organic produce between regional storage and civic food markets.',
            telemetryFields: [
              { label: 'Plate', value: 'KL 07 TR 7712' },
              { label: 'Cargo Payload', value: '6.8 Tons' },
              { label: 'Axle Weight Sensors', value: 'COMPLIANT' },
            ],
          });
        }}
      >
        {/* Driver Cab */}
        <mesh position={[0, 0, 2.6]} castShadow>
          <boxGeometry args={[2.2, 1.8, 1.8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Cargo Container Body */}
        <mesh position={[0, 0.25, -1.0]} castShadow>
          <boxGeometry args={[2.3, 2.2, 5.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
      </group>

      {/* 6. ELECTRIC MOTORCYCLE (TN 09 BX 4582) */}
      <group
        ref={motoRef}
        position={[-30, 0.35, 1.8]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'moto-tn09-violation',
            name: 'Electric Commuter Motorcycle (TN 09 BX 4582)',
            category: 'Micro-Mobility Two-Wheeler',
            status: trafficState === 'NO_HELMET' || trafficState === 'RED_LIGHT_VIOLATION' ? 'warning' : 'optimal',
            efficiency: 98.2,
            description: 'Electric motorcycle flagged by AI roadside ANPR cameras for compliance inspection.',
            telemetryFields: [
              { label: 'Plate', value: 'TN 09 BX 4582' },
              { label: 'Rider Helmet Detected', value: trafficState === 'NO_HELMET' ? 'NO (VIOLATION)' : 'YES' },
              { label: 'Speed', value: `${trafficState === 'NO_HELMET' ? '72' : '38'} km/h` },
              { label: 'Infraction Penalty', value: trafficState === 'NO_HELMET' ? '$150 Challan' : 'None' },
            ],
          });
        }}
      >
        {/* Bike Frame */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.3, 0.45, 1.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Wheels */}
        <mesh position={[0, 0, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.12, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0, -0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.12, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Rider Human Model */}
        <group position={[0, 0.55, 0]}>
          {/* Torso */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.28, 0.45, 0.2]} />
            <meshStandardMaterial color="#e11d48" />
          </mesh>
          {/* Head / Helmet */}
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial
              color={trafficState === 'NO_HELMET' ? '#fcd34d' : '#0f172a'}
              metalness={trafficState === 'NO_HELMET' ? 0.1 : 0.8}
            />
          </mesh>
          {trafficState === 'NO_HELMET' && (
            <mesh position={[0, 0.85, 0]}>
              <ringGeometry args={[0.18, 0.22, 16]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
            </mesh>
          )}
        </group>
      </group>

      {/* 7. EMERGENCY AMBULANCE */}
      <group
        ref={ambulanceRef}
        position={[-42, 0.6, -1.8]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'emergency-ambulance-01',
            name: 'V2X Rapid Response Trauma Ambulance (EMS-01)',
            category: 'Emergency Medical Services',
            status: 'active',
            efficiency: 99.9,
            powerKw: 85.0,
            description: 'Advanced mobile intensive care unit. Broadcasts emergency preemption tokens to intersection traffic lights for automated green-wave priority corridors.',
            telemetryFields: [
              { label: 'Dispatch Code', value: 'RED PRIORITY 1' },
              { label: 'Origin', value: 'City General Hospital' },
              { label: 'Preemption Status', value: 'ALL SIGNALS HELD RED' },
              { label: 'ETA Scene', value: '0.4 min' },
            ],
          });
        }}
      >
        {/* Ambulance Body */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.8, 5.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Emergency Medical Red Stripe */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.22, 0.35, 5.0]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Flashing Siren Lightbar on Roof */}
        <group position={[0, 1.05, 1.2]}>
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[0.4, 0.15, 0.25]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
          </mesh>
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[0.4, 0.15, 0.25]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={3.5} />
          </mesh>
        </group>
      </group>

      {/* 8. ROGUE ERRANT CAR (For Inflatable Barrier Simulation) */}
      <group
        ref={rogueCarRef}
        position={[3.5, 0.35, -25]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'rogue-errant-vehicle',
            name: 'Simulated Errant Trajectory Vehicle',
            category: 'Active Test Simulation',
            status: 'warning',
            efficiency: 94.0,
            description: 'Simulated vehicle with sudden brake failure or steering anomaly heading towards pedestrian sidewalk. Intercepted by pneumatic safety barrier.',
            telemetryFields: [
              { label: 'Trajectory Anomaly', value: 'CRITICAL' },
              { label: 'Impact Absorbed', value: barrierState?.inflated ? 'YES (DEFLECTED)' : 'PENDING' },
              { label: 'Pedestrian Risk', value: barrierState?.inflated ? 'ZERO (PROTECTED)' : 'HIGH' },
            ],
          });
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.65, 3.5]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* 9. ACCIDENT CRASH SCENE (Visible when trafficState === 'ACCIDENT') */}
      {trafficState === 'ACCIDENT' && (
        <group position={[1.5, 0.4, 0.5]}>
          {/* Collided Car A */}
          <group ref={crashCar1Ref} position={[-0.8, 0, 0]} rotation={[0, 0.6, 0.1]}>
            <mesh castShadow>
              <boxGeometry args={[1.7, 0.65, 3.6]} />
              <meshStandardMaterial color="#e11d48" roughness={0.5} />
            </mesh>
            {/* Hazard Flashing Taillights */}
            <mesh position={[0, 0, -1.82]}>
              <boxGeometry args={[1.4, 0.12, 0.05]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3} />
            </mesh>
          </group>

          {/* Collided Car B */}
          <group ref={crashCar2Ref} position={[0.8, 0, 0]} rotation={[0, -0.7, -0.08]}>
            <mesh castShadow>
              <boxGeometry args={[1.7, 0.65, 3.6]} />
              <meshStandardMaterial color="#0284c7" roughness={0.5} />
            </mesh>
            {/* Hazard Flashing Taillights */}
            <mesh position={[0, 0, -1.82]}>
              <boxGeometry args={[1.4, 0.12, 0.05]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3} />
            </mesh>
          </group>

          {/* Emergency Alert Hologram over Crash Scene */}
          <group position={[0, 2.5, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 0.8]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={2.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
