import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Bot,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  RotateCw,
  Truck,
  BatteryCharging,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { CollectionRobotStage, SmartBinData } from './WasteTypes';
import { wasteSounds } from './WasteSounds';

interface WasteCollectionRobotProps {
  stage: CollectionRobotStage;
  targetBin: SmartBinData | null;
  onDispatchTrigger: () => void;
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const WasteCollectionRobot: React.FC<WasteCollectionRobotProps> = ({
  stage,
  targetBin,
  onDispatchTrigger,
  onSelectNode,
  isNight = false,
}) => {
  const robotGroupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Default home position in front of recycling plant
  const homePos: [number, number, number] = [-2.5, 0, 3.5];

  useFrame(({ clock }, delta) => {
    if (!robotGroupRef.current) return;
    const t = clock.getElapsedTime();

    // Beacon rotation
    if (beaconRef.current) {
      beaconRef.current.rotation.y = t * 6;
    }

    // Determine target location based on stage
    let dest = new THREE.Vector3(...homePos);
    if ((stage === 'ROBOT_DISPATCHED' || stage === 'COLLECTING') && targetBin) {
      // Offset slightly in front of the target bin
      dest = new THREE.Vector3(
        targetBin.position[0],
        targetBin.position[1],
        targetBin.position[2] + 1.6
      );
    }

    // Interpolate robot position toward destination
    robotGroupRef.current.position.lerp(dest, Math.min(delta * 2.2, 0.12));

    // Calculate rotation toward target direction
    const currentPos = robotGroupRef.current.position;
    const dir = new THREE.Vector3().subVectors(dest, currentPos);
    if (dir.length() > 0.3) {
      const targetAngle = Math.atan2(dir.x, dir.z);
      robotGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        robotGroupRef.current.rotation.y,
        targetAngle,
        Math.min(delta * 3.5, 0.15)
      );
    }

    // Lift Arm Animation when COLLECTING
    if (armRef.current) {
      if (stage === 'COLLECTING') {
        // Arm reaches up and tilts
        armRef.current.rotation.x = THREE.MathUtils.lerp(
          armRef.current.rotation.x,
          -0.8,
          delta * 3
        );
        armRef.current.position.y = THREE.MathUtils.lerp(
          armRef.current.position.y,
          0.6,
          delta * 3
        );
      } else {
        armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, 0, delta * 3);
        armRef.current.position.y = THREE.MathUtils.lerp(armRef.current.position.y, 0, delta * 3);
      }
    }
  });

  return (
    <group
      ref={robotGroupRef}
      position={homePos}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode({
          id: 'waste-robot-01',
          name: 'Heavy Autonomous Collection Unit (ECO-ROVER #01)',
          category: 'Robotics & Logistics',
          status: 'optimal',
          efficiency: 99.1,
          powerKw: 3.2,
          description:
            'Autonomous heavy-payload electric waste retriever. Navigates smart city corridors, hoists high-capacity compactor bins, and delivers waste directly to primary sorting lines.',
          telemetryFields: [
            { label: 'Operational Stage', value: stage },
            { label: 'Target Objective', value: targetBin ? targetBin.name : 'Stationary Standby' },
            { label: 'Battery Capacity', value: '92% Inductive Rapid-Charge' },
            { label: 'Internal Compactor', value: '340 kg / 800 kg Max' },
            { label: 'Obstacle Avoidance', value: '360° Solid-State Lidar SLAM' },
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
      {/* 1. Main Robot Chassis (Heavy industrial frame) */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.6, 2.2]} />
        <meshStandardMaterial
          color={isNight ? '#0b1120' : '#1e293b'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Hi-Vis Orange / Teal Accent Stripes */}
      <mesh position={[0, 0.45, 1.11]}>
        <planeGeometry args={[1.3, 0.25]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>

      {/* 6 Heavy-Duty All-Terrain Wheels */}
      {[
        [-0.82, 0.3, -0.7],
        [-0.82, 0.3, 0],
        [-0.82, 0.3, 0.7],
        [0.82, 0.3, -0.7],
        [0.82, 0.3, 0],
        [0.82, 0.3, 0.7],
      ].map(([wx, wy, wz], wIdx) => (
        <mesh key={`robot-wheel-${wIdx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
      ))}

      {/* Compactor Tank on Rear Half */}
      <mesh position={[0, 1.05, -0.3]} castShadow>
        <boxGeometry args={[1.35, 0.85, 1.3]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Hydraulic Lift Mast & Gripper Arm on Front Half */}
      <group ref={armRef} position={[0, 0.9, 0.8]}>
        {/* Mast columns */}
        <mesh position={[-0.55, 0.4, 0]}>
          <boxGeometry args={[0.1, 1.0, 0.1]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        <mesh position={[0.55, 0.4, 0]}>
          <boxGeometry args={[0.1, 1.0, 0.1]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        {/* Gripper Fork Crossbar */}
        <mesh position={[0, 0.75, 0.25]}>
          <boxGeometry args={[1.2, 0.1, 0.4]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* Front Lidar Sensor Dome */}
      <mesh position={[0, 0.8, 1.05]}>
        <cylinderGeometry args={[0.14, 0.14, 0.15, 12]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} />
      </mesh>

      {/* Rotating Warning Safety Beacon */}
      <mesh ref={beaconRef} position={[0, 1.6, -0.8]}>
        <cylinderGeometry args={[0.12, 0.15, 0.22, 12]} />
        <meshStandardMaterial
          color={stage === 'COLLECTING' || stage === 'ROBOT_DISPATCHED' ? '#ef4444' : '#f59e0b'}
          emissive={stage === 'COLLECTING' || stage === 'ROBOT_DISPATCHED' ? '#ef4444' : '#f59e0b'}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* ========================================================= */}
      {/* 3D FLOATING ROBOT STAGE HUD DISPLAY */}
      {/* ========================================================= */}
      <Html
        position={[0, 2.6, 0]}
        center
        distanceFactor={7.5}
        className="select-none pointer-events-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-72 bg-slate-950/95 backdrop-blur-xl border border-amber-500/80 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(245,158,11,0.4)] text-slate-100 font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                <Bot className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-300">COLLECTION ROBOT #01</span>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                stage === 'COMPLETED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : stage === 'IDLE'
                  ? 'bg-slate-900 text-slate-400 border border-slate-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-500 animate-pulse'
              }`}
            >
              {stage.replace('_', ' ')}
            </span>
          </div>

          {/* Prompt Required Sequence Pills:
              COLLECTION REQUEST → ROBOT DISPATCHED → COLLECTING → COMPLETED */}
          <div className="grid grid-cols-4 gap-1 mb-2.5 text-[8px] text-center uppercase tracking-tight">
            <div
              className={`p-1 rounded ${
                stage === 'COLLECTION_REQUEST'
                  ? 'bg-amber-600 text-white font-bold animate-pulse'
                  : stage !== 'IDLE'
                  ? 'bg-amber-950/80 text-amber-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              1. REQUEST
            </div>
            <div
              className={`p-1 rounded ${
                stage === 'ROBOT_DISPATCHED'
                  ? 'bg-amber-600 text-white font-bold animate-pulse'
                  : stage === 'COLLECTING' || stage === 'RETURNING' || stage === 'COMPLETED'
                  ? 'bg-amber-950/80 text-amber-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              2. DISPATCH
            </div>
            <div
              className={`p-1 rounded ${
                stage === 'COLLECTING'
                  ? 'bg-red-600 text-white font-bold animate-pulse'
                  : stage === 'RETURNING' || stage === 'COMPLETED'
                  ? 'bg-amber-950/80 text-amber-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              3. COLLECT
            </div>
            <div
              className={`p-1 rounded ${
                stage === 'COMPLETED'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              4. DONE
            </div>
          </div>

          {/* Current Status Details */}
          <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl mb-2.5 text-[10px]">
            {stage === 'IDLE' && (
              <div className="text-slate-400">
                System standby. Monitoring IoT fill levels across all zone clusters.
              </div>
            )}
            {stage === 'COLLECTION_REQUEST' && (
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>AI DETECTED HIGH FILL LEVEL &bull; DISPATCHING...</span>
              </div>
            )}
            {stage === 'ROBOT_DISPATCHED' && (
              <div className="text-sky-300 font-bold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
                <span>NAVIGATING TO {targetBin?.name.split('(')[0] || 'CRITICAL BIN'}</span>
              </div>
            )}
            {stage === 'COLLECTING' && (
              <div className="text-red-300 font-bold flex items-center gap-1.5 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 text-red-400 animate-spin shrink-0" />
                <span>HYDRAULIC ARMS HOISTING & EMPTYING BIN...</span>
              </div>
            )}
            {stage === 'RETURNING' && (
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>RETURNING TO RECYCLING & PROCESSING BAY</span>
              </div>
            )}
            {stage === 'COMPLETED' && (
              <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>CYCLE COMPLETED &bull; BIN CAPACITY RESTORED</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={onDispatchTrigger}
            disabled={stage !== 'IDLE' && stage !== 'COMPLETED'}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{stage === 'IDLE' ? 'TRIGGER COLLECTION RUN' : 'MISSION IN PROGRESS'}</span>
          </button>
        </div>
      </Html>
    </group>
  );
};
