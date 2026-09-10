import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SmartBinData, CollectionRobotStage, WasteMetrics } from './WasteTypes';
import { INITIAL_SMART_BINS, INITIAL_WASTE_METRICS } from './WasteData';
import { wasteSounds } from './WasteSounds';

// Subcomponents
import { SmartWasteBins } from './SmartWasteBins';
import { WasteSegregationSystem } from './WasteSegregationSystem';
import { WasteCollectionRobot } from './WasteCollectionRobot';
import { WasteCollectionVehicle } from './WasteCollectionVehicle';
import { ProcessingAndRecyclingAreas } from './ProcessingAndRecyclingAreas';
import { AIMonitoringStation } from './AIMonitoringStation';
import { WasteDashboardHUD } from './WasteDashboardHUD';

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
      maxDistance={60}
    />
  );
};

interface WasteSceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
}

export const WasteScene: React.FC<WasteSceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
}) => {
  const isNight = simulationState.timeOfDay === 'night' || simulationState.timeOfDay === 'dusk';

  // State Management
  const [bins, setBins] = useState<SmartBinData[]>(INITIAL_SMART_BINS);
  const [selectedBinId, setSelectedBinId] = useState<string | null>('bin-01');
  const [metrics, setMetrics] = useState<WasteMetrics>(INITIAL_WASTE_METRICS);

  // Robot Collection Lifecycle
  const [robotStage, setRobotStage] = useState<CollectionRobotStage>('IDLE');
  const [targetBin, setTargetBin] = useState<SmartBinData | null>(null);

  // Camera Targets
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number]>([0, 18, 22]);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 2, 0]);

  // Handle external camera presets (from FullscreenSceneLayout)
  useEffect(() => {
    if (cameraPreset === 'topDown') {
      setTargetCamPos([0, 32, 0]);
      setTargetLookAt([0, 0, 0]);
    } else if (cameraPreset === 'isometric') {
      setTargetCamPos([18, 20, 18]);
      setTargetLookAt([0, 2, 0]);
    } else if (cameraPreset === 'closeUp') {
      setTargetCamPos([-6.5, 4.5, 9.5]);
      setTargetLookAt([-8, 1.2, 6]);
    } else {
      setTargetCamPos([0, 18, 22]);
      setTargetLookAt([0, 2, 0]);
    }
  }, [cameraPreset]);

  // Handle camera view jumpers from HUD
  const handleCameraJump = (
    view: 'overview' | 'bins' | 'segregation' | 'robot' | 'organic' | 'recycling' | 'station'
  ) => {
    switch (view) {
      case 'overview':
        setTargetCamPos([0, 18, 22]);
        setTargetLookAt([0, 2, 0]);
        break;
      case 'bins':
        setTargetCamPos([-6.5, 4.5, 9.5]);
        setTargetLookAt([-8, 1.2, 6]);
        break;
      case 'segregation':
        setTargetCamPos([0, 6.5, 3.5]);
        setTargetLookAt([0, 2.0, -3.5]);
        break;
      case 'robot':
        setTargetCamPos([-1.5, 4.0, 7.5]);
        setTargetLookAt([-2.5, 1.0, 3.5]);
        break;
      case 'organic':
        setTargetCamPos([-7.5, 7.5, -4.0]);
        setTargetLookAt([-8.5, 3.0, -8.5]);
        break;
      case 'recycling':
        setTargetCamPos([5.0, 7.0, -4.0]);
        setTargetLookAt([4.5, 2.5, -9.5]);
        break;
      case 'station':
        setTargetCamPos([-6.5, 9.0, 12.5]);
        setTargetLookAt([-8.5, 5.0, 8.5]);
        break;
    }
  };

  // Robot Collection Lifecycle Sequence Executor
  const triggerRobotCollection = (chosenBin?: SmartBinData) => {
    if (robotStage !== 'IDLE' && robotStage !== 'COMPLETED') return;

    // Pick critical bin or highest fill bin
    const binToCollect =
      chosenBin ||
      bins.find((b) => b.isCritical || b.fillLevel >= 80) ||
      bins[0];

    setTargetBin(binToCollect);

    // 1. COLLECTION REQUEST
    setRobotStage('COLLECTION_REQUEST');
    wasteSounds.playDispatchAlert();

    // 2. ROBOT DISPATCHED
    setTimeout(() => {
      setRobotStage('ROBOT_DISPATCHED');
    }, 1600);

    // 3. COLLECTING (Robot reaches bin and hoists)
    setTimeout(() => {
      setRobotStage('COLLECTING');
      wasteSounds.playCollectHydraulic();

      // Empty target bin visually
      setBins((prev) =>
        prev.map((b) =>
          b.id === binToCollect.id
            ? { ...b, fillLevel: 4, isCritical: false, status: 'normal' }
            : b
        )
      );

      // Update waste metrics
      setMetrics((prev) => ({
        ...prev,
        wasteCollectedTodayKg: prev.wasteCollectedTodayKg + 65,
        organicWasteKg: prev.organicWasteKg + Math.round((binToCollect.composition.organic / 100) * 65),
        plasticWasteKg: prev.plasticWasteKg + Math.round((binToCollect.composition.plastic / 100) * 65),
        paperWasteKg: prev.paperWasteKg + Math.round((binToCollect.composition.paper / 100) * 65),
        otherWasteKg: prev.otherWasteKg + Math.round((binToCollect.composition.other / 100) * 65),
        recyclingRatePercent: Math.min(99.4, Number((prev.recyclingRatePercent + 0.1).toFixed(1))),
      }));
    }, 4800);

    // 4. RETURNING
    setTimeout(() => {
      setRobotStage('RETURNING');
    }, 7800);

    // 5. COMPLETED
    setTimeout(() => {
      setRobotStage('COMPLETED');
      wasteSounds.playCompleteChime();
    }, 10800);

    // Reset to IDLE after showing completion
    setTimeout(() => {
      setRobotStage('IDLE');
    }, 14000);
  };

  // Toggle Critical state on a bin
  const handleToggleCritical = (binId: string) => {
    setBins((prev) =>
      prev.map((b) => {
        if (b.id === binId) {
          const nextCritical = !b.isCritical;
          const nextFill = nextCritical ? 92 : 35;
          const updated = {
            ...b,
            isCritical: nextCritical,
            fillLevel: nextFill,
            status: nextCritical ? ('critical' as const) : ('normal' as const),
          };
          if (nextCritical && robotStage === 'IDLE') {
            // Auto dispatch robot if critical
            setTimeout(() => {
              triggerRobotCollection(updated);
            }, 800);
          }
          return updated;
        }
        return b;
      })
    );
  };

  // Empty a bin directly
  const handleEmptyBin = (binId: string) => {
    wasteSounds.playCollectHydraulic();
    setBins((prev) =>
      prev.map((b) =>
        b.id === binId ? { ...b, fillLevel: 4, isCritical: false, status: 'normal' } : b
      )
    );
  };

  // Update metrics via simulation button
  const handleUpdateMetrics = (deltaKg: number) => {
    wasteSounds.playBinScanBeep();
    setMetrics((prev) => ({
      ...prev,
      wasteCollectedTodayKg: prev.wasteCollectedTodayKg + deltaKg,
      organicWasteKg: prev.organicWasteKg + Math.round(deltaKg * 0.42),
      plasticWasteKg: prev.plasticWasteKg + Math.round(deltaKg * 0.27),
      paperWasteKg: prev.paperWasteKg + Math.round(deltaKg * 0.18),
      otherWasteKg: prev.otherWasteKg + Math.round(deltaKg * 0.13),
      recyclingRatePercent: Math.min(99.9, Number((prev.recyclingRatePercent + 0.2).toFixed(1))),
    }));
  };

  return (
    <div className="w-full h-full relative select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 18, 22], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        {/* Background Sky / Void Color */}
        <color attach="background" args={[isNight ? '#020e0d' : '#031716']} />

        {/* Ambient & Smart Lighting System */}
        <ambientLight intensity={isNight ? 0.45 : 0.9} color={isNight ? '#99f6e4' : '#ffffff'} />
        <directionalLight
          position={[16, 24, 14]}
          intensity={isNight ? 0.7 : 1.5}
          color={isNight ? '#5eead4' : '#fef08a'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={70}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {/* Area Spotlights & Track Lights */}
        <pointLight position={[0, 8, -3.5]} intensity={2.5} color="#14b8a6" distance={20} />
        <pointLight position={[-8.5, 6, -8.5]} intensity={2.0} color="#10b981" distance={18} />
        <pointLight position={[0, 6, -10.5]} intensity={2.0} color="#f59e0b" distance={18} />
        <pointLight position={[8.5, 6, -8.5]} intensity={2.0} color="#38bdf8" distance={18} />

        {/* Stars in Night Mode */}
        {isNight && <Stars radius={60} depth={40} count={2200} factor={3} />}

        {/* Camera Controls Rig with 360-degree orbit, zoom, pan */}
        <CameraRig targetPosition={targetCamPos} targetLookAt={targetLookAt} />

        {/* Architectural Yard Ground Slab */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[36, 0.1, 32]} />
          <meshStandardMaterial
            color={isNight ? '#041716' : '#0b2422'}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* Ground Grid lines */}
        <Grid
          position={[0, 0.01, 0]}
          args={[36, 32]}
          cellSize={1.5}
          cellThickness={0.8}
          cellColor="#0d9488"
          sectionSize={6}
          sectionThickness={1.2}
          sectionColor="#14b8a6"
          fadeDistance={30}
        />

        {/* Perimeter Service Road Loop (Paved dark road with markings) */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[11.5, 15.5, 48]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>

        {/* ========================================================= */}
        {/* 3D SMART WASTE ENVIRONMENT ACTORS */}
        {/* ========================================================= */}

        {/* 1. Multiple Smart Waste Bins (Organic, Plastic, Paper, Other + Fill Gauge) */}
        <SmartWasteBins
          bins={bins}
          selectedBinId={selectedBinId}
          onSelectBin={(bin) => setSelectedBinId(bin.id)}
          onToggleCritical={handleToggleCritical}
          onEmptyBin={handleEmptyBin}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 2. Automated Waste Segregation System (Input → AI Classification → 4 Chutes → Processing) */}
        <WasteSegregationSystem onSelectNode={onSelectNode} isNight={isNight} />

        {/* 3. Autonomous Collection Robot (Eco-Rover #01 with complete 4-step dispatch animation) */}
        <WasteCollectionRobot
          stage={robotStage}
          targetBin={targetBin}
          onDispatchTrigger={() => triggerRobotCollection()}
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 4. Autonomous Heavy Electric Waste Collection Truck patrolling perimeter */}
        <WasteCollectionVehicle onSelectNode={onSelectNode} isNight={isNight} />

        {/* 5. Processing & Recycling Areas (Organic Bio-Digester, Plastic Extruder, Paper Baler) */}
        <ProcessingAndRecyclingAreas onSelectNode={onSelectNode} isNight={isNight} />

        {/* 6. AI Operations Command & Monitoring Station Tower */}
        <AIMonitoringStation onSelectNode={onSelectNode} isNight={isNight} />
      </Canvas>

      {/* 7. Digital Waste Dashboard HUD Overlay */}
      <WasteDashboardHUD
        metrics={metrics}
        onUpdateMetrics={handleUpdateMetrics}
        onCameraJump={handleCameraJump}
        onTriggerRobotDispatch={() => triggerRobotCollection()}
        robotStage={robotStage}
        bins={bins}
        onSelectBin={(b) => setSelectedBinId(b.id)}
      />
    </div>
  );
};
