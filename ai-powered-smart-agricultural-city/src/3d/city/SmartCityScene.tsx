import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Grid } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { theme } from '../theme/visualTheme';
import { CityRoads } from './CityRoads';
import { CityBuilding } from './CityBuilding';
import { AgricultureZone } from './AgricultureZone';
import { TrafficZone } from './TrafficZone';
import { SchoolZone } from './SchoolZone';
import { MarketZone } from './MarketZone';
import { WasteZone } from './WasteZone';
import { InfrastructureZone } from './InfrastructureZone';
import { PedestrianPath } from './PedestrianPath';
import { EnergyPathway } from './EnergyPathway';
import { AnimatedVehicle } from './AnimatedVehicle';
import { AnimatedPedestrian } from './AnimatedPedestrian';
import { CityDrone } from './CityDrone';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface SmartCitySceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  focusedZonePos?: [number, number, number] | null;
}

// Camera Manager for smooth animated transitions to presets and focused zones
const CameraManager: React.FC<{
  preset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  focusedZonePos?: [number, number, number] | null;
}> = ({ preset = 'overview', focusedZonePos }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Target coordinates for camera interpolation
  const targetPos = useRef(new THREE.Vector3(0, 26, 32));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (focusedZonePos) {
      targetPos.current.set(focusedZonePos[0] + 6, focusedZonePos[1] + 12, focusedZonePos[2] + 14);
      targetLook.current.set(focusedZonePos[0], focusedZonePos[1], focusedZonePos[2]);
      return;
    }

    switch (preset) {
      case 'topDown':
        targetPos.current.set(0, 48, 0.1);
        targetLook.current.set(0, 0, 0);
        break;
      case 'isometric':
        targetPos.current.set(28, 28, 28);
        targetLook.current.set(0, 0, 0);
        break;
      case 'closeUp':
        targetPos.current.set(4, 8, 12);
        targetLook.current.set(0, 0, 0);
        break;
      case 'overview':
      default:
        targetPos.current.set(0, 26, 32);
        targetLook.current.set(0, 0, 0);
        break;
    }
  }, [preset, focusedZonePos]);

  useFrame((_, delta) => {
    const lerpFactor = Math.min(delta * 3.0, 0.15);
    camera.position.lerp(targetPos.current, lerpFactor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, lerpFactor);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={6}
      maxDistance={70}
      autoRotate={false}
    />
  );
};

export const SmartCityScene: React.FC<SmartCitySceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
  focusedZonePos,
}) => {
  // Time of day lighting
  const getLighting = () => {
    switch (simulationState.timeOfDay) {
      case 'dawn':
        return { ambient: '#fda4af', intensity: 0.6, bg: '#0f172a', sunPos: [-20, 10, 15] as [number, number, number] };
      case 'dusk':
        return { ambient: '#f59e0b', intensity: 0.5, bg: '#0b0f19', sunPos: [20, 8, -15] as [number, number, number] };
      case 'night':
        return { ambient: '#1e1b4b', intensity: 0.22, bg: '#030712', sunPos: [0, -10, 0] as [number, number, number] };
      case 'day':
      default:
        return { ambient: '#e0f2fe', intensity: 0.95, bg: '#050c14', sunPos: [22, 28, 18] as [number, number, number] };
    }
  };

  const lighting = getLighting();

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 26, 32], fov: 42 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[lighting.bg]} />
        <ambientLight intensity={lighting.intensity} color={lighting.ambient} />
        <directionalLight
          position={lighting.sunPos}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Sky Stars during Night / Dusk */}
        {(simulationState.timeOfDay === 'night' || simulationState.timeOfDay === 'dusk') && (
          <Stars radius={70} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />
        )}

        {/* Dynamic Camera Control */}
        <CameraManager preset={cameraPreset} focusedZonePos={focusedZonePos} />

        {/* Master City Ground Grid */}
        <Grid
          position={[0, 0, 0]}
          args={[65, 65]}
          cellSize={1.5}
          cellThickness={0.7}
          cellColor={theme.city.smartAccent}
          sectionSize={6}
          sectionThickness={1.5}
          sectionColor={theme.city.smartAccent}
          fadeDistance={55}
        />

        {/* Master City Continuous Ground Terrain Base */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[65, 65]} />
          <meshStandardMaterial color={theme.infrastructure.grassFresh} roughness={0.9} />
        </mesh>

        {/* 1. CITY ROADS (Major 4-way intersection, crossings, lanes) */}
        <CityRoads />

        {/* 2. MAIN ENTRANCE PORTAL (South Gateway onto the boulevard) */}
        <group position={[0, 0, 25.5]}>
          {/* Gateway Arch Columns */}
          <mesh position={[-3.2, 2.5, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 5, 8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
          <mesh position={[3.2, 2.5, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 5, 8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
          {/* Transverse Welcome Beam */}
          <mesh position={[0, 4.8, 0]}>
            <boxGeometry args={[7.2, 0.4, 0.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 4.8, 0.26]}>
            <planeGeometry args={[6.8, 0.3]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
          </mesh>
          {/* Welcome Beacon point light */}
          <pointLight position={[0, 5, 0.5]} color="#10b981" intensity={2} distance={8} />
        </group>

        {/* 3. CENTRAL BIOSPHERE CORE / PUBLIC PLAZA */}
        <group position={[0, 0, 0]}>
          {/* Central AI Spire Beacon */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.3, 0.6, 4.4, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 4.6, 0]}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.9} />
          </mesh>
          <pointLight position={[0, 4.8, 0]} color="#10b981" intensity={3} distance={10} />
        </group>

        {/* 4. TRAFFIC ZONE (Central 4-way intersection) */}
        <TrafficZone
          position={[0, 0, 0]}
          onSelect={() =>
            onSelectNode({
              id: 'traffic',
              name: 'Smart Traffic Management',
              category: 'Autonomous Mobility',
              zoneRoute: '/zone/traffic',
              status: 'optimal',
              efficiency: 98.4,
              powerKw: 110,
              description: 'Adaptive traffic signal AI and induction lane routing coordinating autonomous buses, trucks, and emergency corridors in real time.',
              telemetryFields: [
                { label: 'Average Speed', value: '46', unit: 'km/h' },
                { label: 'Congestion Factor', value: '6.2', unit: '%' },
                { label: 'Signal Sync Rate', value: '99.9', unit: '%' },
              ],
            })
          }
        />

        {/* 5. AGRICULTURAL LAND ZONE (North-West Quadrant) */}
        <AgricultureZone
          position={[-14, 0, -14]}
          droneActive={simulationState.droneSurveillanceActive}
          onSelect={() =>
            onSelectNode({
              id: 'agriculture',
              name: 'Agricultural Biosphere',
              category: 'Precision Agriculture',
              zoneRoute: '/zone/agriculture',
              status: 'optimal',
              efficiency: 94.2,
              powerKw: 420,
              waterUsageLpm: 380,
              description: 'AI-monitored crop beds with automated subsurface drip irrigation, soil moisture sensing, and autonomous pest-detection drones.',
              telemetryFields: [
                { label: 'Soil Moisture', value: '64.2', unit: '%' },
                { label: 'Crop Health Index', value: '87', unit: '%' },
                { label: 'Yield Forecast', value: '42,800', unit: 'kg/day' },
              ],
            })
          }
        />

        {/* 6. SMART SCHOOL ZONE (North-East Quadrant) */}
        <SchoolZone
          position={[14, 0, -14]}
          onSelect={() =>
            onSelectNode({
              id: 'school',
              name: 'Smart Agri-Academy',
              category: 'Education & Community',
              zoneRoute: '/zone/school',
              status: 'optimal',
              efficiency: 97.6,
              powerKw: 180,
              description: 'Net-zero carbon smart school with rooftop solar generation, indoor hydroponics labs, and real-time environmental education tracks.',
              telemetryFields: [
                { label: 'Attendance Rate', value: '99.1', unit: '%' },
                { label: 'Solar Independence', value: '104', unit: '%' },
                { label: 'Indoor Air Quality', value: '98.5', unit: 'AQI' },
              ],
            })
          }
        />

        {/* 7. SMART MARKET ZONE (South-East Quadrant) */}
        <MarketZone
          position={[14, 0, 14]}
          onSelect={() =>
            onSelectNode({
              id: 'market',
              name: 'Smart Bio-Market',
              category: 'Commerce & Food Distribution',
              zoneRoute: '/zone/market',
              status: 'optimal',
              efficiency: 96.1,
              powerKw: 240,
              description: 'Direct farm-to-table digital marketplace featuring robotic clerks, cashless biometric checkout, and zero single-use packaging.',
              telemetryFields: [
                { label: 'Shoppers Active', value: '420' },
                { label: 'Zero-Waste Divert', value: '99.2', unit: '%' },
                { label: 'Farm Delivery Lead', value: '24', unit: 'min' },
              ],
            })
          }
        />

        {/* 8. WASTE MANAGEMENT ZONE (South-West Quadrant) */}
        <WasteZone
          position={[-14, 0, 14]}
          onSelect={() =>
            onSelectNode({
              id: 'waste',
              name: 'Circular Waste & Bio-Refinery',
              category: 'Circular Economy',
              zoneRoute: '/zone/waste',
              status: 'optimal',
              efficiency: 96.8,
              powerKw: 310,
              description: 'Organic anaerobic digesters generating clean methane and bio-fertilizer while autonomous compactor trucks route collection seamlessly.',
              telemetryFields: [
                { label: 'Landfill Diversion', value: '96.8', unit: '%' },
                { label: 'Biogas Generation', value: '480', unit: 'm³/h' },
                { label: 'Truck Fleet Uptime', value: '100', unit: '%' },
              ],
            })
          }
        />

        {/* 9. SMART INFRASTRUCTURE HUB (West Corridor) */}
        <InfrastructureZone
          position={[-14, 0, 0]}
          onSelect={() =>
            onSelectNode({
              id: 'infrastructure',
              name: 'Hydro-Grid & Telemetry Hub',
              category: 'Clean Energy & Utilities',
              zoneRoute: '/zone/infrastructure',
              status: 'optimal',
              efficiency: 99.4,
              powerKw: 1500,
              description: 'Central microgrid coordination, 5G wireless backbone, utility battery banks, and electric vehicle rapid charging stations.',
              telemetryFields: [
                { label: 'Solar Capacity', value: '3,840', unit: 'kW' },
                { label: 'Storage Reserves', value: '94', unit: '%' },
                { label: 'Network Latency', value: '1.4', unit: 'ms' },
              ],
            })
          }
        />

        {/* 10. PEDESTRIAN ENERGY PATHWAY (Generates power from walking footsteps) */}
        <EnergyPathway />

        {/* 11. CONNECTING PEDESTRIAN PATHWAYS (Linking all zones to main road) */}
        <PedestrianPath start={[-4.5, -14]} end={[-8.5, -14]} width={1.8} hasTrees hasStreetlights />
        <PedestrianPath start={[4.5, -14]} end={[8.5, -14]} width={1.8} hasTrees hasStreetlights />
        <PedestrianPath start={[-4.5, 14]} end={[-8.5, 14]} width={1.8} hasTrees hasStreetlights />
        <PedestrianPath start={[4.5, 14]} end={[8.5, 14]} width={1.8} hasTrees hasStreetlights />
        <PedestrianPath start={[-14, -4.5]} end={[-14, -8.5]} width={1.8} hasTrees hasStreetlights />
        <PedestrianPath start={[14, -4.5]} end={[14, -8.5]} width={1.8} hasTrees hasStreetlights />

        {/* 12. PERIMETER & BACKGROUND CITY BUILDINGS (One connected urban feeling) */}
        <CityBuilding position={[-22, 0, -22]} size={[4.2, 5.5, 4.2]} color="#0f172a" hasSolarRoof hasAntenna />
        <CityBuilding position={[-22, 0, -14]} size={[3.8, 4.2, 4.0]} color="#1e293b" hasGreenery />
        <CityBuilding position={[22, 0, -22]} size={[4.5, 6.2, 4.0]} color="#1e1b4b" hasSolarRoof />
        <CityBuilding position={[22, 0, -14]} size={[3.5, 4.8, 3.8]} color="#0f172a" hasAntenna />
        <CityBuilding position={[22, 0, 22]} size={[4.0, 5.0, 4.2]} color="#1e293b" hasSolarRoof hasGreenery />
        <CityBuilding position={[-22, 0, 22]} size={[4.2, 4.5, 4.0]} color="#0f172a" />

        {/* 13. ANIMATED VEHICLES (Moving cars, buses, trucks, emergency vehicle along roads) */}
        {/* North-South Roads */}
        <AnimatedVehicle type="bus" lane="north" offset={1.3} speed={5} initialProgress={0.05} />
        <AnimatedVehicle type="car" lane="north" offset={1.3} speed={7} initialProgress={0.45} color="#38bdf8" />
        <AnimatedVehicle type="car" lane="south" offset={1.3} speed={6.5} initialProgress={0.2} color="#f59e0b" />
        <AnimatedVehicle type="emergency" lane="south" offset={1.3} speed={8.5} initialProgress={0.7} />

        {/* East-West Roads */}
        <AnimatedVehicle type="truck" lane="east" offset={1.3} speed={4.8} initialProgress={0.15} />
        <AnimatedVehicle type="car" lane="east" offset={1.3} speed={7.2} initialProgress={0.6} color="#10b981" />
        <AnimatedVehicle type="car" lane="west" offset={1.3} speed={6.8} initialProgress={0.35} color="#ec4899" />
        <AnimatedVehicle type="truck" lane="west" offset={1.3} speed={5} initialProgress={0.85} />

        {/* 14. ANIMATED PEDESTRIANS CROSSING ZEBRA CROSSINGS */}
        {/* South Zebra Crossing (pedestrian walks West to East) */}
        <AnimatedPedestrian
          startPos={[-2.4, 0, 3.2]}
          endPos={[2.4, 0, 3.2]}
          speed={0.9}
          initialProgress={0.15}
          color="#38bdf8"
        />
        {/* North Zebra Crossing (pedestrian walks East to West) */}
        <AnimatedPedestrian
          startPos={[2.4, 0, -3.2]}
          endPos={[-2.4, 0, -3.2]}
          speed={0.85}
          initialProgress={0.55}
          color="#a855f7"
        />
        {/* East Zebra Crossing (pedestrian walks South to North) */}
        <AnimatedPedestrian
          startPos={[3.2, 0, 2.4]}
          endPos={[3.2, 0, -2.4]}
          speed={0.95}
          initialProgress={0.3}
          color="#10b981"
        />

        {/* 15. FLYING SURVEY DRONES OVER THE CITY */}
        {simulationState.droneSurveillanceActive && (
          <CityDrone
            centerPosition={[0, 6, 0]}
            flightRadius={12}
            flightHeight={6}
            speed={0.65}
            type="surveillance"
            scanColor="#38bdf8"
          />
        )}
      </Canvas>
    </div>
  );
};
