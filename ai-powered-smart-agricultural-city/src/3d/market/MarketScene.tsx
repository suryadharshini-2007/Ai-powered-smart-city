import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { ProductDetail } from './MarketTypes';
import { MARKET_PRODUCTS } from './MarketData';

// Market Subcomponents
import { MarketBuilding } from './MarketBuilding';
import { DigitalShelves } from './DigitalShelves';
import { RobotShopkeeper } from './RobotShopkeeper';
import { SmartCheckoutStation } from './SmartCheckoutStation';
import { SmartCart } from './SmartCart';
import { CustomerMonitoring } from './CustomerMonitoring';
import { MarketHUD } from './MarketHUD';

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
      minDistance={3}
      maxDistance={50}
    />
  );
};

interface MarketSceneProps {
  simulationState: SimulationState;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
}

export const MarketScene: React.FC<MarketSceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
}) => {
  const isNight = simulationState.timeOfDay === 'night' || simulationState.timeOfDay === 'dusk';

  // Product Inspection Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);

  // Robot Assistance Demonstration State
  const [isDemonstrating, setIsDemonstrating] = useState(false);

  // External Trigger for Checkout sequence
  const [triggerCheckout, setTriggerCheckout] = useState(false);

  // Camera Target States
  const [targetCamPos, setTargetCamPos] = useState<[number, number, number]>([0, 15, 20]);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 2, 0]);

  // Handle external camera presets (from FullscreenSceneLayout)
  useEffect(() => {
    if (cameraPreset === 'topDown') {
      setTargetCamPos([0, 28, 0]);
      setTargetLookAt([0, 0, 0]);
    } else if (cameraPreset === 'isometric') {
      setTargetCamPos([16, 18, 16]);
      setTargetLookAt([0, 1.5, 0]);
    } else if (cameraPreset === 'closeUp') {
      setTargetCamPos([-2.5, 3.5, 6]);
      setTargetLookAt([-2.2, 1.2, 3.2]);
    } else {
      setTargetCamPos([0, 15, 20]);
      setTargetLookAt([0, 2, 0]);
    }
  }, [cameraPreset]);

  // Handle quick camera jumps to specific market aisles
  const handleCameraJump = (
    view: 'overview' | 'rice' | 'vegetables' | 'tomato' | 'wheat' | 'checkout' | 'robot'
  ) => {
    switch (view) {
      case 'overview':
        setTargetCamPos([0, 15, 20]);
        setTargetLookAt([0, 2, 0]);
        break;
      case 'rice':
        setTargetCamPos([-6.5, 4.2, 5.0]);
        setTargetLookAt([-7.5, 1.8, 0]);
        break;
      case 'vegetables':
        setTargetCamPos([6.5, 4.2, 1.5]);
        setTargetLookAt([7.5, 1.5, -3.2]);
        break;
      case 'tomato':
        setTargetCamPos([6.5, 4.0, 7.5]);
        setTargetLookAt([7.5, 1.5, 3.2]);
        break;
      case 'wheat':
        setTargetCamPos([0, 6.0, -3.0]);
        setTargetLookAt([0, 2.5, -8.5]);
        break;
      case 'checkout':
        setTargetCamPos([0, 4.5, 12.0]);
        setTargetLookAt([0, 1.5, 7.2]);
        break;
      case 'robot':
        setTargetCamPos([-2.2, 3.0, 6.5]);
        setTargetLookAt([-2.2, 1.2, 3.2]);
        break;
    }
  };

  // Trigger Demonstration of Assistance (camera glides in and flags state)
  const handleTriggerRobotAssist = () => {
    setIsDemonstrating(true);
    setTargetCamPos([-3.5, 3.5, 5.5]);
    setTargetLookAt([-4.0, 1.2, 1.0]);

    setTimeout(() => {
      setIsDemonstrating(false);
    }, 6000);
  };

  // Trigger Checkout sequence
  const handleTriggerCheckout = () => {
    setTriggerCheckout(true);
    setTargetCamPos([0, 4.5, 12.0]);
    setTargetLookAt([0, 1.5, 7.2]);

    setTimeout(() => {
      setTriggerCheckout(false);
    }, 1000);
  };

  return (
    <div className="w-full h-full relative select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 15, 20], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        {/* Background Sky / Void Color */}
        <color attach="background" args={[isNight ? '#050a14' : '#0f172a']} />

        {/* Ambient & Smart Lighting System */}
        <ambientLight intensity={isNight ? 0.45 : 0.9} color={isNight ? '#93c5fd' : '#ffffff'} />
        <directionalLight
          position={[14, 22, 12]}
          intensity={isNight ? 0.7 : 1.5}
          color={isNight ? '#60a5fa' : '#fef08a'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Dynamic Track Accent Lights on Produce & Checkout */}
        <pointLight position={[-7.5, 5.0, 0]} intensity={2.0} color="#38bdf8" distance={15} />
        <pointLight position={[7.5, 5.0, -3.2]} intensity={2.0} color="#22c55e" distance={15} />
        <pointLight position={[7.5, 5.0, 3.2]} intensity={2.0} color="#ef4444" distance={15} />
        <pointLight position={[0, 5.5, -8.5]} intensity={2.2} color="#f59e0b" distance={15} />
        <pointLight position={[0, 4.5, 7.2]} intensity={2.5} color="#06b6d4" distance={15} />

        {/* Stars in Night Mode */}
        {isNight && <Stars radius={60} depth={35} count={2000} factor={3} />}

        {/* Camera Controls Rig with 360 rotation, zoom, pan, orbit */}
        <CameraRig targetPosition={targetCamPos} targetLookAt={targetLookAt} />

        {/* ========================================================= */}
        {/* SMART MARKET 3D SCENE ACTORS */}
        {/* ========================================================= */}

        {/* 1. Market Building (Modern canopy, terrazzo floor, steel trusses, CCTVs, telemetry board) */}
        <MarketBuilding onSelectNode={onSelectNode} isNight={isNight} />

        {/* 2. Digital Shelves & Product Sections (Rice, Vegetables, Tomato, Wheat with Holographic Prices) */}
        <DigitalShelves
          onSelectNode={onSelectNode}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          isNight={isNight}
        />

        {/* 3. AI Robot Shopkeeper (BOT-MKT-09 PRANAV with interactive actions & movement) */}
        <RobotShopkeeper
          onSelectNode={onSelectNode}
          onRequestCheckout={handleTriggerCheckout}
          onNavigateToProducts={() => handleCameraJump('vegetables')}
          isNight={isNight}
        />

        {/* 4. Smart Checkout Station (Conveyor, dual scanner arch, laser beam, animated 4-step sequence) */}
        <SmartCheckoutStation
          onSelectNode={onSelectNode}
          externalTriggerCheckout={triggerCheckout}
          isNight={isNight}
        />

        {/* 5. Autonomous Smart Shopping Carts (Aisle 1 & Aisle 2) */}
        <SmartCart
          initialPosition={[-5.2, 0, -2]}
          patrolAisle="left"
          onSelectNode={onSelectNode}
          isNight={isNight}
        />
        <SmartCart
          initialPosition={[5.2, 0, 1]}
          patrolAisle="right"
          onSelectNode={onSelectNode}
          isNight={isNight}
        />

        {/* 6. Customer Movement & Flow Monitoring (Animated 3D shoppers with IoT beacons) */}
        <CustomerMonitoring onSelectNode={onSelectNode} isNight={isNight} />
      </Canvas>

      {/* 7. Futuristic Market HUD Overlay */}
      <MarketHUD
        selectedProduct={selectedProduct}
        onCloseProductModal={() => setSelectedProduct(null)}
        onCameraJump={handleCameraJump}
        onTriggerRobotAssist={handleTriggerRobotAssist}
        onTriggerCheckout={handleTriggerCheckout}
        isDemonstrating={isDemonstrating}
      />
    </div>
  );
};
