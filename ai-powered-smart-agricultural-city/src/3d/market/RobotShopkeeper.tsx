import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Bot,
  Sparkles,
  ShoppingBag,
  Navigation,
  CheckCircle2,
  Smile,
  CreditCard,
  X,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { RobotShopkeeperState, RobotAction } from './MarketTypes';
import { marketSounds } from './MarketSounds';

interface RobotShopkeeperProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  onRequestCheckout?: () => void;
  onNavigateToProducts?: () => void;
  isNight?: boolean;
}

export const RobotShopkeeper: React.FC<RobotShopkeeperProps> = ({
  onSelectNode,
  onRequestCheckout,
  onNavigateToProducts,
}) => {
  const [robotState, setRobotState] = useState<RobotShopkeeperState>({
    id: 'BOT-MKT-09 (PRANAV)',
    name: 'Pranav - Smart Market Concierge Bot',
    status: 'ACTIVE',
    customersAssisted: 482,
    currentTask: 'Patrolling central market concourse & greeting visitors',
    dialogue: 'Namaste! Welcome to Smart Agricultural Bio-Market. How can I assist you?',
  });

  const [isOpenPanel, setIsOpenPanel] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Positions
  const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(-2.2, 0, 3.2));
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(-2.2, 0, 3.2));
  const robotGroupRef = useRef<THREE.Group>(null);
  const eyeVisorRef = useRef<THREE.Mesh>(null);
  const armRightRef = useRef<THREE.Group>(null);
  const armLeftRef = useRef<THREE.Group>(null);
  const hoverRingRef = useRef<THREE.Mesh>(null);

  // Animation frame loop
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Smooth movement interpolation
    currentPosRef.current.lerp(targetPosRef.current, Math.min(delta * 2.8, 0.12));
    if (robotGroupRef.current) {
      robotGroupRef.current.position.x = currentPosRef.current.x;
      robotGroupRef.current.position.z = currentPosRef.current.z;
      // Hover bobbing
      robotGroupRef.current.position.y = 0.4 + Math.sin(t * 3.5) * 0.08;

      // Subtle rotation orienting toward movement target
      const dx = targetPosRef.current.x - currentPosRef.current.x;
      const dz = targetPosRef.current.z - currentPosRef.current.z;
      if (Math.abs(dx) > 0.05 || Math.abs(dz) > 0.05) {
        const angle = Math.atan2(dx, dz);
        robotGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          robotGroupRef.current.rotation.y,
          angle,
          delta * 4
        );
      } else {
        // Idle gentle swaying
        robotGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          robotGroupRef.current.rotation.y,
          Math.sin(t * 1.2) * 0.25,
          delta * 2
        );
      }
    }

    // Hover propulsion ring rotation
    if (hoverRingRef.current) {
      hoverRingRef.current.rotation.z = t * 4;
    }

    // Arms gesturing
    if (armRightRef.current) {
      armRightRef.current.rotation.x = Math.sin(t * 2.5) * 0.3 - 0.2;
    }
    if (armLeftRef.current) {
      armLeftRef.current.rotation.x = -Math.sin(t * 2.5) * 0.3 - 0.2;
    }

    // Eye visor blinking glow
    if (eyeVisorRef.current) {
      const mat = eyeVisorRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 2.0 + Math.sin(t * 8) * 0.4;
      }
    }
  });

  const handleRobotClick = (e: any) => {
    e.stopPropagation();
    marketSounds.playRobotChime();
    setIsOpenPanel(true);
    onSelectNode({
      id: 'robot-shopkeeper-pranav',
      name: robotState.name,
      category: 'Autonomous Retail Robotics',
      status: 'optimal',
      efficiency: 99.7,
      powerKw: 0.65,
      description:
        'Next-generation autonomous retail assistant equipped with SLAM indoor LiDAR navigation, bilingual natural speech synthesizer, RFID inventory locator, and instant checkout link.',
      telemetryFields: [
        { label: 'Robot Identifier', value: robotState.id },
        { label: 'Operational Status', value: robotState.status },
        { label: 'Customers Assisted', value: `${robotState.customersAssisted} today` },
        { label: 'Current Objective', value: robotState.currentTask },
        { label: 'Navigation Battery', value: '94% (Wireless inductive pad)' },
        { label: 'AI Voice Core', value: 'Gemini Multimodal Agro-Agent' },
      ],
    });
  };

  const handleAction = (action: RobotAction) => {
    marketSounds.playRobotChime();
    setIsMoving(true);

    switch (action) {
      case 'WELCOME CUSTOMER':
        targetPosRef.current.set(-1.0, 0, 4.2);
        setRobotState((prev) => ({
          ...prev,
          status: 'ACTIVE',
          customersAssisted: prev.customersAssisted + 1,
          currentTask: 'Greeting incoming customers at market entrance concourse',
          dialogue: 'Welcome! Today our organic Basmati Rice and vine Tomatoes are 100% farm fresh.',
        }));
        break;

      case 'SHOW PRODUCTS':
        targetPosRef.current.set(3.5, 0, 0.5);
        setRobotState((prev) => ({
          ...prev,
          status: 'NAVIGATING',
          customersAssisted: prev.customersAssisted + 1,
          currentTask: 'Guiding shopper to hydroponic vegetable & tomato displays',
          dialogue: 'Right this way! The aeroponic greens and crisp tomatoes are in prime harvest condition.',
        }));
        if (onNavigateToProducts) onNavigateToProducts();
        break;

      case 'ASSIST CUSTOMER':
        // Move towards the customer in front of Rice shelf
        targetPosRef.current.set(-4.8, 0, 0.5);
        setRobotState((prev) => ({
          ...prev,
          status: 'ASSISTING',
          customersAssisted: prev.customersAssisted + 1,
          currentTask: 'Assisting customer in Rice Section with organic grain selection',
          dialogue: 'Allow me to lift this 2kg Basmati sack into your autonomous smart cart!',
        }));
        break;

      case 'START PURCHASE':
        // Move towards checkout counter
        targetPosRef.current.set(0, 0, 6.8);
        setRobotState((prev) => ({
          ...prev,
          status: 'PURCHASING',
          customersAssisted: prev.customersAssisted + 1,
          currentTask: 'Directing customer to high-speed biometric smart checkout station',
          dialogue: 'Let us complete your contactless RFID checkout! Proceeding to Payment Station.',
        }));
        if (onRequestCheckout) {
          setTimeout(() => onRequestCheckout(), 900);
        }
        break;
    }
  };

  return (
    <group
      ref={robotGroupRef}
      position={[-2.2, 0.4, 3.2]}
      onClick={handleRobotClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* ========================================================= */}
      {/* 3D ROBOT BODY */}
      {/* ========================================================= */}

      {/* 1. Magnetic Hover Thruster Base with Glowing Ring */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={hoverRingRef} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.52, 20]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      {/* Blue thruster downlight */}
      <pointLight position={[0, 0.2, 0]} color="#38bdf8" intensity={1.8} distance={3.5} />

      {/* 2. Main Torso (Aerodynamic white-and-cyan chassis) */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.45, 8, 16]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Torso Chest Screen displaying Market Cart icon */}
      <mesh position={[0, 0.82, 0.28]}>
        <boxGeometry args={[0.26, 0.18, 0.04]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.8} />
      </mesh>

      {/* 3. Articulated Head with Expressive LED Optic Visor */}
      <group position={[0, 1.35, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Visor Screen */}
        <mesh ref={eyeVisorRef} position={[0, 0.02, 0.22]}>
          <boxGeometry args={[0.28, 0.11, 0.06]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>
        {/* Antenna with status beacon */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* 4. Articulated Mechanical Arms */}
      {/* Right Arm */}
      <group ref={armRightRef} position={[0.38, 0.85, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.3, 6, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* Hand Tool */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={armLeftRef} position={[-0.38, 0.85, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.3, 6, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* Hand Tool */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Floating Status Banner above Robot */}
      <Html position={[0, 2.1, 0]} center distanceFactor={8} className="pointer-events-none select-none">
        <div className="bg-sky-950/90 border border-sky-400 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center gap-1.5 font-mono text-[10px] text-sky-200 font-bold whitespace-nowrap">
          <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>ROBOT SHOPKEEPER: BOT-MKT-09</span>
        </div>
      </Html>

      {/* ========================================================= */}
      {/* INTERACTIVE ROBOT CONTROL CARD (WHEN CLICKED) */}
      {/* ========================================================= */}
      {isOpenPanel && (
        <Html position={[0, 1.2, 0.6]} center distanceFactor={7} className="select-none pointer-events-auto">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-80 bg-slate-950/95 backdrop-blur-xl border border-sky-500/60 rounded-2xl p-4 shadow-[0_0_35px_rgba(2,132,199,0.5)] text-slate-100 font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-300 tracking-wider">
                    {robotState.id}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    STATUS: <span className="text-emerald-400 font-bold">{robotState.status}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenPanel(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
                <div className="text-[9px] text-slate-400 uppercase">Customers Assisted</div>
                <div className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  {robotState.customersAssisted}
                </div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
                <div className="text-[9px] text-slate-400 uppercase">AI Voice Triage</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Online
                </div>
              </div>
            </div>

            {/* Current Task Box */}
            <div className="bg-slate-900/90 border border-sky-900/50 p-2 rounded-xl mb-3 text-[10px]">
              <div className="text-sky-400 font-semibold mb-0.5 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-sky-400" />
                CURRENT TASK:
              </div>
              <div className="text-slate-300 leading-snug">{robotState.currentTask}</div>
            </div>

            {/* Dialogue Bubble */}
            <div className="bg-sky-950/60 border border-sky-800/60 p-2 rounded-xl mb-3 text-[10px] text-sky-200 italic">
              &ldquo;{robotState.dialogue}&rdquo;
            </div>

            {/* Required Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAction('WELCOME CUSTOMER')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                WELCOME CUSTOMER
              </button>

              <button
                type="button"
                onClick={() => handleAction('SHOW PRODUCTS')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                SHOW PRODUCTS
              </button>

              <button
                type="button"
                onClick={() => handleAction('ASSIST CUSTOMER')}
                className="px-2.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-md col-span-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                ASSIST CUSTOMER
              </button>

              <button
                type="button"
                onClick={() => handleAction('START PURCHASE')}
                className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-md col-span-1"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-200" />
                START PURCHASE
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
