import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { ClassroomScreenMode, SportType } from './SchoolTypes';

// Subcomponents
import { CampusTerrain } from './CampusTerrain';
import { SchoolBuilding } from './SchoolBuilding';
import { SmartClassroom } from './SmartClassroom';
import { RooftopEcoSystem } from './RooftopEcoSystem';
import { AiAssistanceRobots } from './AiAssistanceRobots';
import { SportsComplex } from './SportsComplex';
import { AiGameGuideRobot } from './AiGameGuideRobot';
import { CourtPreparationRobot } from './CourtPreparationRobot';
import { SmartRestroom } from './SmartRestroom';
import { SmartParking } from './SmartParking';
import { SchoolHUD } from './SchoolHUD';

interface CameraRigProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}

const CameraRig: React.FC<CameraRigProps> = ({ targetPosition, targetLookAt }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame((_, delta) => {
    // Smoothly interpolate camera position towards target
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
      minDistance={5}
      maxDistance={75}
    />
  );
};

interface SchoolSceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
}

export const SchoolScene: React.FC<SchoolSceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
}) => {
  const isNight = simulationState.timeOfDay === 'night' || simulationState.timeOfDay === 'dusk';

  // Smart Classroom Screen Mode state (4 modes required)
  const [screenMode, setScreenMode] = useState<ClassroomScreenMode>('DIGITAL_LESSON');

  // Sport Guide selected sport state (6 sports required)
  const [selectedSport, setSelectedSport] = useState<SportType>('Cricket');

  // AI Assistance Demonstration animation state
  const [isDemonstrating, setIsDemonstrating] = useState(false);

  // Camera Target States
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number]>([0, 22, 32]);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 2, 2]);

  // Handle external camera presets
  useEffect(() => {
    if (cameraPreset === 'topDown') {
      setTargetCamPos([0, 48, 2]);
      setTargetLookAt([0, 0, 0]);
    } else if (cameraPreset === 'isometric') {
      setTargetCamPos([28, 26, 28]);
      setTargetLookAt([0, 2, 0]);
    } else if (cameraPreset === 'closeUp') {
      setTargetCamPos([-7, 5, -2]);
      setTargetLookAt([-7, 2, -8]);
    } else {
      setTargetCamPos([0, 22, 32]);
      setTargetLookAt([0, 2, 2]);
    }
  }, [cameraPreset]);

  // Cycle Classroom Screen Mode
  const handleCycleScreenMode = () => {
    setScreenMode((prev) => {
      switch (prev) {
        case 'DIGITAL_LESSON':
          return 'AI_CONTENT';
        case 'AI_CONTENT':
          return 'INTERACTIVE_DIAGRAM';
        case 'INTERACTIVE_DIAGRAM':
          return 'STUDENT_ANALYTICS';
        case 'STUDENT_ANALYTICS':
        default:
          return 'DIGITAL_LESSON';
      }
    });
  };

  // Trigger AI Robot Assistance Demonstration
  const handleDemonstrateAssistance = () => {
    setIsDemonstrating(true);
    // Smoothly pan camera closer to the assistance action
    setTargetCamPos([3, 4.5, 14]);
    setTargetLookAt([2, 1.2, 9]);

    setTimeout(() => {
      setIsDemonstrating(false);
    }, 7000);
  };

  // Handle Campus Quick Navigation Jumps
  const handleCameraJump = (
    view: 'overview' | 'classroom' | 'sports' | 'solar' | 'parking' | 'restroom'
  ) => {
    switch (view) {
      case 'overview':
        setTargetCamPos([0, 22, 32]);
        setTargetLookAt([0, 2, 2]);
        break;
      case 'classroom':
        setTargetCamPos([-7, 4.5, -2.5]);
        setTargetLookAt([-7, 2, -8]);
        break;
      case 'sports':
        setTargetCamPos([16, 15, 20]);
        setTargetLookAt([17, 0, 6]);
        break;
      case 'solar':
        setTargetCamPos([0, 16, 3]);
        setTargetLookAt([0, 8, -7]);
        break;
      case 'parking':
        setTargetCamPos([-18, 9, 27]);
        setTargetLookAt([-18, 1, 17]);
        break;
      case 'restroom':
        setTargetCamPos([-21, 6, 3]);
        setTargetLookAt([-21, 1.5, -4]);
        break;
    }
  };

  return (
    <div className="w-full h-full relative select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 22, 32], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        {/* Sky / Environment Color */}
        <color attach="background" args={[isNight ? '#050b14' : '#0f172a']} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={isNight ? 0.35 : 0.85} color={isNight ? '#93c5fd' : '#ffffff'} />
        <directionalLight
          position={[18, 28, 16]}
          intensity={isNight ? 0.6 : 1.4}
          color={isNight ? '#60a5fa' : '#fef08a'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={90}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
        />

        {/* Accent Point Lights */}
        <pointLight position={[0, 8, 0]} intensity={2.5} color="#38bdf8" distance={25} />
        <pointLight position={[18, 5, 8]} intensity={2.2} color="#22c55e" distance={22} />
        <pointLight position={[-18, 5, 18]} intensity={2.2} color="#06b6d4" distance={20} />

        {/* Stars in Night Mode */}
        {isNight && <Stars radius={80} depth={45} count={2500} factor={3.5} />}

        {/* Dynamic Camera Rig with OrbitControls */}
        <CameraRig targetPosition={targetCamPos} targetLookAt={targetLookAt} />

        {/* ========================================================= */}
        {/* CAMPUS 3D SCENE ACTORS & ZONES */}
        {/* ========================================================= */}

        {/* 1. Green Campus Grounds, Trees, Pathways, Perimeter */}
        <CampusTerrain onSelectNode={onSelectNode} isNight={isNight} />

        {/* 2. Main Building & Specialty Labs (AI, Robotics, Science, Computer, Library, AI Reception, Medical, Gaming) */}
        <SchoolBuilding onSelectNode={onSelectNode} isNight={isNight} />

        {/* 3. Smart Classroom (Teacher, Students, Desks, Interactive Smart Screen) */}
        <SmartClassroom
          onSelectNode={onSelectNode}
          screenMode={screenMode}
          onCycleScreenMode={handleCycleScreenMode}
          isNight={isNight}
        />

        {/* 4. Rooftop Solar Photovoltaic & Rainwater Harvesting System */}
        <RooftopEcoSystem onSelectNode={onSelectNode} isNight={isNight} />

        {/* 5. Autonomous AI Assistance Robots (with "DEMONSTRATE ASSISTANCE" interaction) */}
        <AiAssistanceRobots
          onSelectNode={onSelectNode}
          onRequestDemonstration={handleDemonstrateAssistance}
          isDemonstrating={isDemonstrating}
          isNight={isNight}
        />

        {/* 6. Sports Complex (Football field, Basketball court, Running track, Multi-sport, Playground) */}
        <SportsComplex onSelectNode={onSelectNode} isNight={isNight} />

        {/* 7. AI Game Guide Robot (Cricket, Football, Basketball, Volleyball, Kabaddi, Badminton) */}
        <AiGameGuideRobot
          onSelectNode={onSelectNode}
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
          isNight={isNight}
        />

        {/* 8. Automatic Court Preparation Robot (with 5-step automated preparation sequence) */}
        <CourtPreparationRobot
          onSelectNode={onSelectNode}
          selectedSport={selectedSport}
          isNight={isNight}
        />

        {/* 9. Smart Restroom (Sensor taps, auto flush, water saving, leak detection, UV cleaning, reuse system) */}
        <SmartRestroom onSelectNode={onSelectNode} isNight={isNight} />

        {/* 10. Smart Parking & Electric School Bus (Occupancy sensors: AVAILABLE, OCCUPIED, EV CHARGING) */}
        <SmartParking onSelectNode={onSelectNode} isNight={isNight} />
      </Canvas>

      {/* Interactive HUD Overlay */}
      <SchoolHUD
        screenMode={screenMode}
        onCycleScreenMode={handleCycleScreenMode}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
        onDemonstrateAssistance={handleDemonstrateAssistance}
        isDemonstrating={isDemonstrating}
        onCameraJump={handleCameraJump}
      />
    </div>
  );
};
