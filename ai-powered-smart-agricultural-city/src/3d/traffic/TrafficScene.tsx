import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import {
  TrafficStateMode,
  AccidentTelemetry,
  PedestrianCrossingState,
  InflatableBarrierState,
  ViolationRecord,
} from './TrafficTypes';
import { RoadIntersection } from './RoadIntersection';
import { SmartTrafficSignals } from './SmartTrafficSignals';
import { AiViolationScreen } from './AiViolationScreen';
import { TrafficDrone } from './TrafficDrone';
import { PedestrianSafetyGates } from './PedestrianSafetyGates';
import { InflatableBarrier } from './InflatableBarrier';
import { EnergyHarvestingPathway } from './EnergyHarvestingPathway';
import { TrafficVehicles } from './TrafficVehicles';
import { TrafficDashboardHUD } from './TrafficDashboardHUD';
import { TrafficSimulationBar } from './TrafficSimulationBar';

interface TrafficSceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
}

// Camera Director component handling presets and smooth framing
const CameraDirector: React.FC<{
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  focusTarget: THREE.Vector3 | null;
}> = ({ cameraPreset = 'overview', focusTarget }) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    if (focusTarget) {
      // Smooth focus on specified target
      camera.position.set(focusTarget.x + 8, focusTarget.y + 6, focusTarget.z + 8);
      controlsRef.current.target.copy(focusTarget);
      controlsRef.current.update();
      return;
    }

    switch (cameraPreset) {
      case 'overview':
        camera.position.set(24, 20, 26);
        controlsRef.current.target.set(0, 1, 0);
        break;
      case 'topDown':
        camera.position.set(0, 42, 0.1);
        controlsRef.current.target.set(0, 0, 0);
        break;
      case 'isometric':
        camera.position.set(22, 18, 22);
        controlsRef.current.target.set(0, 1, 0);
        break;
      case 'closeUp':
        camera.position.set(8, 6, 9);
        controlsRef.current.target.set(0, 1, 0);
        break;
    }
    controlsRef.current.update();
  }, [cameraPreset, camera, focusTarget]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={4}
      maxDistance={70}
    />
  );
};

export const TrafficScene: React.FC<TrafficSceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
}) => {
  const isNight =
    simulationState.timeOfDay === 'night' || simulationState.timeOfDay === 'dusk';

  // 1. Primary Traffic Mode State
  const [trafficMode, setTrafficMode] = useState<TrafficStateMode>('NORMAL');

  // 2. Metrics & Counters
  const [vehicleCount, setVehicleCount] = useState(1248);
  const [violationCount, setViolationCount] = useState(37);
  const [accidentCount, setAccidentCount] = useState(2);

  // 3. Traffic Signals State (Normal Cycle: NS Green / EW Red -> NS Red / EW Green)
  const [nsLightState, setNsLightState] = useState<'RED' | 'YELLOW' | 'GREEN'>('GREEN');
  const [ewLightState, setEwLightState] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');

  // Dynamic light cycle timer during normal traffic
  useEffect(() => {
    if (trafficMode !== 'NORMAL' && trafficMode !== 'CONGESTION') return;

    const interval = setInterval(() => {
      setNsLightState((prev) => {
        if (prev === 'GREEN') {
          setEwLightState('RED');
          return 'YELLOW';
        } else if (prev === 'YELLOW') {
          setEwLightState('GREEN');
          return 'RED';
        } else {
          setEwLightState('YELLOW');
          return 'GREEN';
        }
      });
    }, 7000 / simulationState.simulationSpeed);

    return () => clearInterval(interval);
  }, [trafficMode, simulationState.simulationSpeed]);

  // Periodic vehicle count increment
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleCount((prev) => prev + 1);
    }, 3500 / simulationState.simulationSpeed);
    return () => clearInterval(interval);
  }, [simulationState.simulationSpeed]);

  // 4. Accident Detection & Emergency Pipeline State
  const [accidentState, setAccidentState] = useState<AccidentTelemetry>({
    detected: false,
    location: 'Central Junction',
    severity: 'HIGH',
    confidence: 97,
    alertSent: false,
    stage: 'idle',
    commStep: 0,
  });

  // 5. Pedestrian Crossing State & Automated Gates
  const [crossingState, setCrossingState] = useState<PedestrianCrossingState>({
    active: false,
    step: 0,
    gateAngle: -Math.PI / 2,
    lightState: 'RED',
    pedestrianProgress: 0,
  });

  // 6. Inflatable Barrier State
  const [barrierState, setBarrierState] = useState<InflatableBarrierState>({
    inflated: false,
    inflationProgress: 0,
    status: 'STANDBY',
    impactRisk: false,
  });

  // 7. Active Violation Record for AI Screen
  const [activeViolation, setActiveViolation] = useState<ViolationRecord | null>(null);

  // Camera focus target
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);

  // SIMULATION HANDLERS

  // 1. SIMULATE ACCIDENT
  const handleTriggerAccident = useCallback(() => {
    setTrafficMode('ACCIDENT');
    setAccidentCount((prev) => prev + 1);
    setFocusTarget(new THREE.Vector3(1.5, 1, 0.5));

    // Drone moves toward accident and scanning beam activates
    setAccidentState({
      detected: true,
      location: 'Central Junction',
      severity: 'HIGH',
      confidence: 97,
      alertSent: true,
      stage: 'drone_investigating',
      commStep: 1, // Step 1: DRONE
    });

    // Animate communication path:
    // DRONE -> AI TRAFFIC SYSTEM -> CONTROL CENTER -> HOSPITAL -> AMBULANCE
    setTimeout(() => {
      setAccidentState((prev) => ({ ...prev, commStep: 2, stage: 'accident_confirmed' }));
    }, 1200);

    setTimeout(() => {
      setAccidentState((prev) => ({ ...prev, commStep: 3, stage: 'alert_broadcast' }));
    }, 2400);

    setTimeout(() => {
      setAccidentState((prev) => ({ ...prev, commStep: 4, stage: 'ambulance_enroute' }));
    }, 3600);

    setTimeout(() => {
      setAccidentState((prev) => ({ ...prev, commStep: 5, stage: 'scene_secured' }));
    }, 4800);
  }, []);

  // 2. SIMULATE OVERSPEED
  const handleTriggerOverspeed = useCallback(() => {
    setTrafficMode('OVERSPEED');
    setViolationCount((prev) => prev + 1);
    setFocusTarget(new THREE.Vector3(-1.8, 1, 0));

    const rec: ViolationRecord = {
      id: `VIO-${Date.now().toString().slice(-4)}`,
      vehiclePlate: 'TN 74 AE 8819',
      vehicleType: 'High-Performance EV Sedan',
      violation: 'Overspeed in Urban Corridor',
      speed: '86 km/h (Limit: 40)',
      confidence: 98,
      status: 'Challan Dispatched',
      timestamp: 'Just now',
    };
    setActiveViolation(rec);
  }, []);

  // 3. SIMULATE NO HELMET
  const handleTriggerNoHelmet = useCallback(() => {
    setTrafficMode('NO_HELMET');
    setViolationCount((prev) => prev + 1);
    setFocusTarget(new THREE.Vector3(0, 1, 1.8));

    const rec: ViolationRecord = {
      id: 'VIO-4582',
      vehiclePlate: 'TN 09 BX 4582',
      vehicleType: 'EV Motorcycle',
      violation: 'No Helmet / Red Light Violation',
      speed: '72 km/h',
      confidence: 96,
      status: 'Recorded',
      timestamp: 'Just now',
    };
    setActiveViolation(rec);
  }, []);

  // 4. SIMULATE WRONG WAY
  const handleTriggerWrongWay = useCallback(() => {
    setTrafficMode('WRONG_WAY');
    setViolationCount((prev) => prev + 1);
    setFocusTarget(new THREE.Vector3(1.8, 1, 6));

    const rec: ViolationRecord = {
      id: `VIO-WW-${Date.now().toString().slice(-3)}`,
      vehiclePlate: 'TN 03 MC 2011',
      vehicleType: 'Autonomous Compact EV',
      violation: 'Wrong Way Lane Encroachment',
      speed: '44 km/h',
      confidence: 99,
      status: 'Flagged to Police',
      timestamp: 'Just now',
    };
    setActiveViolation(rec);
  }, []);

  // 5. SIMULATE CONGESTION
  const handleTriggerCongestion = useCallback(() => {
    setTrafficMode('CONGESTION');
    setFocusTarget(new THREE.Vector3(0, 2, 0));
  }, []);

  // 6. SIMULATE PEDESTRIAN CROSSING
  const handleTriggerPedestrianCrossing = useCallback(() => {
    setTrafficMode('PEDESTRIAN_CROSSING');
    setFocusTarget(new THREE.Vector3(0, 2, 9));

    // Step 1: Pedestrian detection activates
    setCrossingState({
      active: true,
      step: 1,
      gateAngle: -Math.PI / 2,
      lightState: 'GREEN',
      pedestrianProgress: 0,
    });

    // Step 2: Nearby vehicles slow/stop
    setTimeout(() => {
      setCrossingState((prev) => ({ ...prev, step: 2 }));
    }, 800);

    // Step 3: Traffic signal changes to RED for vehicles
    setTimeout(() => {
      setCrossingState((prev) => ({ ...prev, step: 3, lightState: 'RED' }));
      setNsLightState('RED');
      setEwLightState('RED');
    }, 1600);

    // Step 4: Safety gates close the vehicle path (arms lower)
    setTimeout(() => {
      setCrossingState((prev) => ({ ...prev, step: 4, gateAngle: 0 }));
    }, 2400);

    // Step 5: Pedestrian signal becomes green
    setTimeout(() => {
      setCrossingState((prev) => ({ ...prev, step: 5 }));
    }, 3200);

    // Step 6: Pedestrians cross (animate progress from 0 to 1 over 4 seconds)
    const startTime = Date.now();
    const duration = 4000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCrossingState((prev) => ({ ...prev, step: 6, pedestrianProgress: progress }));

      if (progress >= 1) {
        clearInterval(interval);
        // Step 7: Crossing completes
        setCrossingState((prev) => ({ ...prev, step: 7 }));

        // Step 8: Gates reopen
        setTimeout(() => {
          setCrossingState((prev) => ({ ...prev, step: 8, gateAngle: -Math.PI / 2 }));
        }, 1000);

        // Step 9: Vehicles resume
        setTimeout(() => {
          setCrossingState((prev) => ({
            ...prev,
            step: 9,
            active: false,
            lightState: 'GREEN',
          }));
          setNsLightState('GREEN');
          setTrafficMode('NORMAL');
        }, 2200);
      }
    }, 50);
  }, []);

  // 7. SIMULATE DANGEROUS VEHICLE (INFLATABLE BARRIER)
  const handleTriggerDangerousVehicle = useCallback(() => {
    setTrafficMode('DANGEROUS_VEHICLE');
    setFocusTarget(new THREE.Vector3(8.5, 2, 10.5));

    // 1. System detects dangerous movement & warning appears
    setBarrierState({
      inflated: false,
      inflationProgress: 0,
      status: 'ACTIVATING',
      impactRisk: true,
    });

    // 2. Barrier inflates rapidly
    setTimeout(() => {
      setBarrierState({
        inflated: true,
        inflationProgress: 1,
        status: 'ACTIVATING',
        impactRisk: true,
      });
    }, 600);

    // 3. Vehicle approaches & barrier absorbs/redirects impact
    setTimeout(() => {
      setBarrierState({
        inflated: true,
        inflationProgress: 1,
        status: 'IMPACT_ABSORBED',
        impactRisk: true,
      });
    }, 1800);

    // 4. Pedestrian safety status becomes PROTECTED
    setTimeout(() => {
      setBarrierState({
        inflated: true,
        inflationProgress: 1,
        status: 'PROTECTED',
        impactRisk: true,
      });
    }, 2800);
  }, []);

  // RESET NORMAL
  const handleResetNormal = useCallback(() => {
    setTrafficMode('NORMAL');
    setFocusTarget(null);
    setAccidentState({
      detected: false,
      location: 'Central Junction',
      severity: 'HIGH',
      confidence: 97,
      alertSent: false,
      stage: 'idle',
      commStep: 0,
    });
    setCrossingState({
      active: false,
      step: 0,
      gateAngle: -Math.PI / 2,
      lightState: 'GREEN',
      pedestrianProgress: 0,
    });
    setBarrierState({
      inflated: false,
      inflationProgress: 0,
      status: 'STANDBY',
      impactRisk: false,
    });
    setActiveViolation(null);
    setNsLightState('GREEN');
    setEwLightState('RED');
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D WEBGL CANVAS VIEWPORT */}
      <Canvas
        camera={{ position: [24, 20, 26], fov: 45 }}
        gl={{ antialias: true }}
        shadows
      >
        <color attach="background" args={[isNight ? '#030712' : '#071524']} />
        <ambientLight intensity={isNight ? 0.35 : 0.85} color="#e0f2fe" />
        <directionalLight
          position={[25, 35, 20]}
          intensity={isNight ? 0.6 : 1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={120}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
        />
        {/* Soft fill light */}
        <directionalLight position={[-20, 25, -20]} intensity={0.4} color="#38bdf8" />

        {isNight && <Stars radius={80} depth={50} count={3000} factor={4} />}

        {/* Orbit Controls & Camera Director */}
        <CameraDirector cameraPreset={cameraPreset} focusTarget={focusTarget} />

        {/* 1. Road Intersection, Sidewalks, Markings, Skyline */}
        <RoadIntersection onSelectNode={onSelectNode} isNight={isNight} />

        {/* 2. 4-Way Smart Traffic Signals with CCTV & Solar */}
        <SmartTrafficSignals
          onSelectNode={onSelectNode}
          nsLightState={nsLightState}
          ewLightState={ewLightState}
          pedestrianWalk={crossingState.active && crossingState.step >= 5 && crossingState.step <= 7}
          isNight={isNight}
        />

        {/* 3. Physical Roadside AI Violation Screen */}
        <AiViolationScreen
          onSelectNode={onSelectNode}
          activeViolation={activeViolation}
          isNight={isNight}
        />

        {/* 4. Autonomous Accident Detection Drone */}
        <TrafficDrone
          onSelectNode={onSelectNode}
          accidentState={accidentState}
          isNight={isNight}
        />

        {/* 5. Automatic Pedestrian Safety Gates at Zebra Crossing */}
        <PedestrianSafetyGates
          onSelectNode={onSelectNode}
          crossingState={crossingState}
          isNight={isNight}
        />

        {/* 6. Impact-Safe Rapid Inflatable Barrier */}
        <InflatableBarrier
          onSelectNode={onSelectNode}
          barrierState={barrierState}
          isNight={isNight}
        />

        {/* 7. Kinetic Energy-Generating Pedestrian Sidewalk Pathway */}
        <EnergyHarvestingPathway onSelectNode={onSelectNode} isNight={isNight} />

        {/* 8. Moving Traffic Fleet (Cars, Bus, Truck, Motorcycle, Ambulance) */}
        <TrafficVehicles
          trafficState={trafficMode}
          accidentState={accidentState}
          barrierState={barrierState}
          nsLightState={nsLightState}
          ewLightState={ewLightState}
          pedestriansCrossing={crossingState.active && crossingState.step >= 3 && crossingState.step <= 7}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />
      </Canvas>

      {/* 2D HUD OVERLAY (TOP METRICS & ALERT BANNERS) */}
      <div className="absolute top-16 left-4 right-4 z-10 pointer-events-none">
        <TrafficDashboardHUD
          trafficState={trafficMode}
          accidentState={accidentState}
          crossingState={crossingState}
          barrierState={barrierState}
          vehicleCount={vehicleCount}
          violationCount={violationCount}
          accidentCount={accidentCount}
        />
      </div>

      {/* 2D HUD OVERLAY (BOTTOM SIMULATION CONTROLS) */}
      <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <TrafficSimulationBar
            currentMode={trafficMode}
            onTriggerAccident={handleTriggerAccident}
            onTriggerOverspeed={handleTriggerOverspeed}
            onTriggerNoHelmet={handleTriggerNoHelmet}
            onTriggerWrongWay={handleTriggerWrongWay}
            onTriggerCongestion={handleTriggerCongestion}
            onTriggerPedestrianCrossing={handleTriggerPedestrianCrossing}
            onTriggerDangerousVehicle={handleTriggerDangerousVehicle}
            onResetNormal={handleResetNormal}
          />
        </div>
      </div>
    </div>
  );
};
