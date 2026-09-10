import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import {
  StreetlightData,
  CCTVCameraData,
  SolarData,
  WaterInfrastructureData,
  RoadInfrastructureData,
  EVChargerData,
  SmartPoleData,
  InfrastructureMetrics,
} from './InfrastructureTypes';
import {
  INITIAL_STREETLIGHTS,
  INITIAL_CCTV_CAMERAS,
  INITIAL_SOLAR_DATA,
  INITIAL_WATER_DATA,
  INITIAL_ROAD_DATA,
  INITIAL_EV_CHARGERS,
  INITIAL_SMART_POLES,
  INITIAL_INFRA_METRICS,
} from './InfrastructureData';
import { infraSounds } from './InfrastructureSounds';

// Subcomponents
import { SmartStreetlights } from './SmartStreetlights';
import { CCTVAndSafetySystem } from './CCTVAndSafetySystem';
import { SolarAndEnergySystem } from './SolarAndEnergySystem';
import { WaterManagementSystem } from './WaterManagementSystem';
import { EVChargingHub } from './EVChargingHub';
import { SmartRoadAndTraffic } from './SmartRoadAndTraffic';
import { SmartPolesAndTelecom } from './SmartPolesAndTelecom';
import { InfrastructureHUD } from './InfrastructureHUD';

interface CameraRigProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}

const CameraRig: React.FC<CameraRigProps> = ({ targetPosition, targetLookAt }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame((_, delta) => {
    camera.position.lerp(new THREE.Vector3(...targetPosition), Math.min(delta * 2.5, 0.15));
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(...targetLookAt),
        Math.min(delta * 2.5, 0.15)
      );
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minDistance={3}
      maxDistance={70}
    />
  );
};

interface InfrastructureSceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
}

export const InfrastructureScene: React.FC<InfrastructureSceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
}) => {
  const isNight = simulationState.timeOfDay === 'night' || simulationState.timeOfDay === 'dusk';

  // Core State
  const [streetlights, setStreetlights] = useState<StreetlightData[]>(INITIAL_STREETLIGHTS);
  const [selectedLightId, setSelectedLightId] = useState<string | null>('light-02');

  const [cctvCameras, setCctvCameras] = useState<CCTVCameraData[]>(INITIAL_CCTV_CAMERAS);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const [solarData, setSolarData] = useState<SolarData>(INITIAL_SOLAR_DATA);
  const [waterData, setWaterData] = useState<WaterInfrastructureData>(INITIAL_WATER_DATA);
  const [roadData, setRoadData] = useState<RoadInfrastructureData>(INITIAL_ROAD_DATA);
  const [evChargers, setEvChargers] = useState<EVChargerData[]>(INITIAL_EV_CHARGERS);
  const [selectedChargerId, setSelectedChargerId] = useState<string | null>('ev-bay-01');
  const [smartPoles, setSmartPoles] = useState<SmartPoleData[]>(INITIAL_SMART_POLES);
  const [metrics, setMetrics] = useState<InfrastructureMetrics>(INITIAL_INFRA_METRICS);

  // Camera Target States
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number]>([0, 20, 24]);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 0, 0]);

  // Track vehicles & pedestrians positions to calculate proximity for automatic streetlight brightening
  const entitiesPosRef = useRef<{
    vehicles: [number, number, number][];
    pedestrians: [number, number, number][];
  }>({
    vehicles: [],
    pedestrians: [],
  });

  const handleVehiclePositions = useCallback((positions: [number, number, number][]) => {
    entitiesPosRef.current.vehicles = positions;
  }, []);

  const handlePedestrianPositions = useCallback((positions: [number, number, number][]) => {
    entitiesPosRef.current.pedestrians = positions;
  }, []);

  // Continuous Proximity Detection & Dynamic Streetlight Brightness Adjustment
  useEffect(() => {
    const interval = setInterval(() => {
      const { vehicles, pedestrians } = entitiesPosRef.current;
      const allEntities: { pos: [number, number, number]; type: string }[] = [
        ...vehicles.map((p) => ({ pos: p, type: 'Autonomous EV' })),
        ...pedestrians.map((p) => ({ pos: p, type: 'Pedestrian' })),
      ];

      setStreetlights((prevLights) =>
        prevLights.map((light) => {
          // Check distance to closest entity
          let detected = false;
          let entityName: string | null = null;

          for (const ent of allEntities) {
            const dx = ent.pos[0] - light.position[0];
            const dz = ent.pos[2] - light.position[2];
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < light.sensorRadius) {
              detected = true;
              entityName = ent.type;
              break;
            }
          }

          const targetBrightness = detected ? light.activeBrightness : light.idleBrightness;
          const targetWatts = detected ? 75 : 24;

          // Smooth interpolation
          const newBrightness = Math.round(
            light.brightness + (targetBrightness - light.brightness) * 0.4
          );
          const newWatts = Math.round(
            light.energyConsumptionWatts + (targetWatts - light.energyConsumptionWatts) * 0.4
          );

          return {
            ...light,
            motionDetected: detected,
            approachingEntity: entityName,
            brightness: newBrightness,
            energyConsumptionWatts: newWatts,
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Real-time Simulation: EV Charging increment and metrics update
  useEffect(() => {
    const simInterval = setInterval(() => {
      // 1. Increment EV battery if charging
      setEvChargers((prev) =>
        prev.map((charger) => {
          if (!charger.isCharging) return charger;
          const nextPercent =
            charger.batteryPercent >= charger.targetBatteryPercent
              ? charger.batteryPercent
              : charger.batteryPercent + 1;

          return {
            ...charger,
            batteryPercent: nextPercent,
            status:
              nextPercent >= charger.targetBatteryPercent
                ? 'Completed'
                : 'Charging (Ultra-Fast DC)',
          };
        })
      );

      // 2. Water usage cycle
      setWaterData((prev) => {
        if (prev.hasActiveLeak && !prev.valveIsolated) {
          return {
            ...prev,
            waterLevelPercent: Math.max(10, Number((prev.waterLevelPercent - 0.05).toFixed(1))),
          };
        }
        return prev;
      });

      // 3. Solar slight fluctuation
      setSolarData((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        const newGen = Number((prev.solarGenerationKw + delta).toFixed(1));
        return {
          ...prev,
          solarGenerationKw: newGen,
          gridUsageKw: Number((prev.energyConsumptionKw - newGen).toFixed(1)),
        };
      });
    }, 1200);

    return () => clearInterval(simInterval);
  }, []);

  // Update high-level metrics
  useEffect(() => {
    const totalGen = Number((solarData.solarGenerationKw + roadData.piezoelectricGenerationKw).toFixed(1));
    const activeStreetlightsCount = streetlights.filter((l) => l.brightness > 50).length;
    const occupiedChargersCount = evChargers.filter((c) => c.isCharging).length;

    setMetrics({
      totalPowerGenerationKw: totalGen,
      totalPowerConsumptionKw: solarData.energyConsumptionKw,
      bessChargePercent: solarData.batteryPercent,
      streetlightsActive: streetlights.length,
      smartPolesOnline: smartPoles.length,
      evChargersOccupied: occupiedChargersCount,
      cctvStreamsActive: cctvCameras.length,
      waterReservesLiters: Math.round(145000 * (waterData.waterLevelPercent / 100)),
      leakAnomalyDetected: waterData.hasActiveLeak && !waterData.valveIsolated,
    });
  }, [solarData, roadData, streetlights, evChargers, smartPoles, cctvCameras, waterData]);

  // Handlers
  const handleToggleLightForce = (lightId: string) => {
    setStreetlights((prev) =>
      prev.map((l) => {
        if (l.id !== lightId) return l;
        const isCurrentlyBright = l.brightness >= 80;
        return {
          ...l,
          brightness: isCurrentlyBright ? 25 : 100,
          motionDetected: !isCurrentlyBright,
          energyConsumptionWatts: isCurrentlyBright ? 24 : 78,
          approachingEntity: isCurrentlyBright ? null : 'Manual Proximity Simulation',
        };
      })
    );
  };

  const handleSimulateApproach = () => {
    infraSounds.playLightTrigger();
    // Temporarily trigger motion on all corridor streetlights to demonstrate automatic brightening
    setStreetlights((prev) =>
      prev.map((l) => ({
        ...l,
        brightness: 100,
        motionDetected: true,
        energyConsumptionWatts: 78,
        approachingEntity: 'Autonomous Fleet Approach',
      }))
    );
  };

  const handleToggleLeak = () => {
    setWaterData((prev) => {
      if (prev.hasActiveLeak) {
        // Resolve / isolate leak
        return {
          ...prev,
          hasActiveLeak: false,
          valveIsolated: false,
          leakStatus: 'Normal (0 Leaks Detected)',
          leakRateLpm: 0,
        };
      } else {
        // Trigger simulated leak
        return {
          ...prev,
          hasActiveLeak: true,
          valveIsolated: false,
          leakStatus: 'Acoustic Alert: Fissure Detected',
          leakRateLpm: 18.4,
        };
      }
    });
  };

  const handleToggleCharging = (chargerId: string) => {
    setEvChargers((prev) =>
      prev.map((ch) => {
        if (ch.id !== chargerId) return ch;
        return {
          ...ch,
          isCharging: !ch.isCharging,
          status: !ch.isCharging ? 'Charging (Ultra-Fast DC)' : 'Idle / Available',
        };
      })
    );
  };

  const handleBoostCharging = () => {
    infraSounds.playEVChargePulse();
    setEvChargers((prev) =>
      prev.map((ch) => ({
        ...ch,
        isCharging: true,
        chargingPowerKw: 350,
        status: 'Charging (Ultra-Fast DC)',
      }))
    );
  };

  // Camera Presets
  const handleCameraJump = (
    view:
      | 'overview'
      | 'streetlights'
      | 'cctv'
      | 'road'
      | 'solar'
      | 'water'
      | 'chargers'
      | 'poles'
  ) => {
    infraSounds.playClick();
    switch (view) {
      case 'overview':
        setTargetCamPos([0, 20, 24]);
        setTargetLookAt([0, 0, 0]);
        break;
      case 'streetlights':
        setTargetCamPos([0, 6.5, 9.5]);
        setTargetLookAt([0, 3.5, 4.5]);
        setSelectedLightId('light-02');
        break;
      case 'cctv':
        setTargetCamPos([0, 8.0, 9.0]);
        setTargetLookAt([0, 5.8, 4.5]);
        setSelectedCameraId('cctv-01');
        break;
      case 'road':
        setTargetCamPos([0, 10, 10]);
        setTargetLookAt([0, 0.5, 0]);
        break;
      case 'solar':
        setTargetCamPos([-10.5, 9.0, -1.0]);
        setTargetLookAt([-10.5, 2.5, -8.5]);
        break;
      case 'water':
        setTargetCamPos([-10.5, 8.5, 14.5]);
        setTargetLookAt([-10.5, 2.5, 7.5]);
        break;
      case 'chargers':
        setTargetCamPos([10.5, 7.5, -1.5]);
        setTargetLookAt([10.5, 1.5, -7.5]);
        setSelectedChargerId('ev-bay-01');
        break;
      case 'poles':
        setTargetCamPos([-4.5, 9.5, 9.5]);
        setTargetLookAt([-4.5, 4.0, 4.5]);
        break;
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      {/* HUD Overlay */}
      <InfrastructureHUD
        metrics={metrics}
        onCameraJump={handleCameraJump}
        onSimulateApproach={handleSimulateApproach}
        onToggleLeak={handleToggleLeak}
        onBoostCharging={handleBoostCharging}
        hasActiveLeak={waterData.hasActiveLeak && !waterData.valveIsolated}
      />

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 20, 24], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        <color attach="background" args={[isNight ? '#050716' : '#0a0d24']} />
        <ambientLight intensity={isNight ? 0.35 : 0.85} color="#e0e7ff" />
        <directionalLight
          position={[15, 30, 15]}
          intensity={isNight ? 0.4 : 1.4}
          color="#f8fafc"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={60}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        <pointLight position={[0, 12, 0]} intensity={2.0} color="#6366f1" distance={30} />

        {isNight && <Stars radius={80} depth={50} count={3000} factor={4} saturation={0.8} />}

        {/* Camera Rig with Smooth Orbit & Lerping */}
        <CameraRig targetPosition={targetCamPos} targetLookAt={targetLookAt} />

        {/* Civic Sub-surface Grid Array */}
        <Grid
          position={[0, -0.01, 0]}
          args={[60, 60]}
          cellSize={1.5}
          cellThickness={0.8}
          cellColor="#312e81"
          sectionSize={6}
          sectionThickness={1.2}
          sectionColor="#4f46e5"
          fadeDistance={45}
        />

        {/* 1. Smart Road & Autonomous Traffic System */}
        <SmartRoadAndTraffic
          roadData={roadData}
          onSelectNode={onSelectNode}
          onVehiclePositionsUpdate={handleVehiclePositions}
          onPedestrianPositionsUpdate={handlePedestrianPositions}
          isNight={isNight}
        />

        {/* 2. Smart Streetlights with Dynamic Proximity Brightness */}
        <SmartStreetlights
          streetlights={streetlights}
          selectedLightId={selectedLightId}
          onSelectLight={(l) => setSelectedLightId(l.id)}
          onToggleLightForce={handleToggleLightForce}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 3. AI CCTV & Public Safety System */}
        <CCTVAndSafetySystem
          cameras={cctvCameras}
          selectedCameraId={selectedCameraId}
          onSelectCamera={(c) => setSelectedCameraId(c.id)}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 4. Solar Generation & Battery Energy Storage (BESS) */}
        <SolarAndEnergySystem
          solarData={solarData}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 5. Smart Municipal Water Management & Acoustic Leak Detection */}
        <WaterManagementSystem
          waterData={waterData}
          onToggleLeak={handleToggleLeak}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 6. Ultra-Fast DC EV Charging Hub */}
        <EVChargingHub
          chargers={evChargers}
          selectedChargerId={selectedChargerId}
          onSelectCharger={(ch) => setSelectedChargerId(ch.id)}
          onToggleCharging={handleToggleCharging}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 7. Smart Poles & 5G Telecom Mesh */}
        <SmartPolesAndTelecom
          poles={smartPoles}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />
      </Canvas>
    </div>
  );
};
