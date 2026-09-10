import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { AiRobotState } from './SchoolTypes';

interface AiAssistanceRobotsProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  onRequestDemonstration?: () => void;
  isDemonstrating?: boolean;
  isNight?: boolean;
}

export const AiAssistanceRobots: React.FC<AiAssistanceRobotsProps> = ({
  onSelectNode,
  onRequestDemonstration,
  isDemonstrating = false,
  isNight = false,
}) => {
  const [robotState, setRobotState] = useState<AiRobotState>({
    id: 'AI-SCH-01 (Aether)',
    name: 'Autonomous Student Assistance & Guidance Android',
    status: 'Patrolling',
    currentTask: 'Campus Wayfinding & STEM Lab Guidance',
    studentsAssisted: 148,
    safetyStatus: '100% Safe (360° LiDAR & Ultrasonic Collision Avoidance)',
    isDemonstrating: false,
    position: [0, 0, 10],
  });

  const [studentAssistedCount, setStudentAssistedCount] = useState(148);

  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const demoProgress = useRef(0);

  // Position references
  const patrolX = useRef(0);
  const patrolZ = useRef(10);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (robotRef.current) {
      if (isDemonstrating) {
        // Demonstration mode: glide directly towards waiting student at (3.5, 0, 8.5)
        demoProgress.current = Math.min(demoProgress.current + delta * 0.7, 1.0);

        const targetX = 2.4;
        const targetZ = 8.5;

        robotRef.current.position.x = THREE.MathUtils.lerp(0, targetX, demoProgress.current);
        robotRef.current.position.z = THREE.MathUtils.lerp(10, targetZ, demoProgress.current);
        robotRef.current.rotation.y = -Math.PI / 3;

        // Hover bob
        robotRef.current.position.y = 0.55 + Math.sin(t * 4) * 0.05;
      } else {
        demoProgress.current = 0;
        // Normal patrol pacing along pedestrian spine
        patrolZ.current = 10 + Math.sin(t * 0.5) * 3.5;
        robotRef.current.position.set(0, 0.55 + Math.sin(t * 4) * 0.04, patrolZ.current);
        robotRef.current.rotation.y = Math.cos(t * 0.5) > 0 ? 0 : Math.PI;
      }
    }

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.3;
    }
  });

  const handleSelectRobot = () => {
    onSelectNode({
      id: 'ai-robot-aether',
      name: 'Campus AI Assistance Robot (AI-SCH-01)',
      category: 'Autonomous Campus AI',
      status: 'active',
      efficiency: 99.8,
      powerKw: 0.45,
      description:
        'Bi-pedal/hover intelligent companion android equipped with conversational NLP, interactive student learning diagnostics, real-time timetable synchronization, and emergency safety escorting.',
      telemetryFields: [
        { label: 'Robot ID', value: 'AI-SCH-01 (Aether)' },
        { label: 'Status', value: isDemonstrating ? 'Assisting Student' : 'Patrolling Campus' },
        { label: 'Current Task', value: 'Student Assistance & Campus Guidance' },
        { label: 'Students Assisted', value: `${studentAssistedCount} Today` },
        { label: 'Safety Status', value: '100% Compliant • Collision Shield Active' },
        { label: 'Battery Reserve', value: '92% (Wireless Pad Charged)' },
      ],
    });
  };

  const handleDemonstrateClick = (e: any) => {
    e.stopPropagation();
    setStudentAssistedCount((prev) => prev + 1);
    onRequestDemonstration?.();
    handleSelectRobot();
  };

  return (
    <group>
      {/* 1. THE AI ASSISTANCE ROBOT (AI-SCH-01) */}
      <group
        ref={robotRef}
        position={[0, 0.55, 10]}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectRobot();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Omni-directional Hover Base with Glowing Ring */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.45, 0.25, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <torusGeometry args={[0.42, 0.04, 12, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={isNight ? 3 : 2}
          />
        </mesh>

        {/* Torso */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.48, 0.65, 0.3]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Chest Display Touchscreen */}
        <mesh position={[0, 0.32, 0.16]}>
          <planeGeometry args={[0.32, 0.24]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={1.8}
          />
        </mesh>

        {/* Articulated Head */}
        <group ref={headRef} position={[0, 0.76, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.28, 0.28]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Curved Visor Eyes */}
          <mesh position={[0, 0.02, 0.15]}>
            <planeGeometry args={[0.26, 0.09]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={3}
            />
          </mesh>
          {/* Top Antenna with Status LED */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={3}
            />
          </mesh>
        </group>

        {/* Arms */}
        {[-0.3, 0.3].map((armX, aIdx) => (
          <mesh key={`robot-arm-${aIdx}`} position={[armX, 0.28, 0]}>
            <boxGeometry args={[0.09, 0.45, 0.1]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
          </mesh>
        ))}

        {/* Interactive Holographic HUD over Robot */}
        <Html position={[0, 1.4, 0]} center distanceFactor={8} className="pointer-events-auto select-none">
          <div className="bg-slate-950/95 border border-sky-400/80 p-3 rounded-xl shadow-2xl text-center w-[250px] backdrop-blur-md font-mono text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-bold text-sky-400 uppercase">
                  AI-SCH-01 (AETHER)
                </span>
              </div>
              <span className="text-[8px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-300 font-bold border border-sky-800">
                {isDemonstrating ? 'ASSISTING' : 'STANDBY'}
              </span>
            </div>

            <div className="text-[9px] text-slate-300 space-y-1 mb-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Task:</span>
                <span className="font-bold text-white truncate max-w-[130px]">
                  {isDemonstrating ? 'STEM Guidance' : 'Campus Patrol'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Students Assisted:</span>
                <span className="font-bold text-emerald-400">{studentAssistedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Status:</span>
                <span className="font-bold text-sky-300">100% Safe</span>
              </div>
            </div>

            {/* List of Functions */}
            <div className="text-[8px] text-slate-400 border-t border-slate-800/80 pt-1 mb-2 space-y-0.5">
              <div>&bull; Student assistance &bull; Info retrieval</div>
              <div>&bull; Classroom assistance &bull; Campus guidance</div>
              <div>&bull; Safety monitoring</div>
            </div>

            {/* DEMONSTRATE ASSISTANCE BUTTON */}
            <button
              onClick={handleDemonstrateClick}
              className="w-full py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-[9px] uppercase tracking-wider transition-all shadow-md shadow-sky-900/40 text-center"
            >
              DEMONSTRATE ASSISTANCE
            </button>
          </div>
        </Html>
      </group>

      {/* 2. Waiting Student by the Garden Path for Demonstration (at x=3.2, z=8.5) */}
      <group position={[3.2, 0, 8.5]}>
        {/* Student Torso */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.34, 0.55, 0.22]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.32, 0]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.09, 0.35, 0]}>
          <boxGeometry args={[0.11, 0.7, 0.13]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.09, 0.35, 0]}>
          <boxGeometry args={[0.11, 0.7, 0.13]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* School Backpack */}
        <mesh position={[0, 0.92, -0.15]}>
          <boxGeometry args={[0.26, 0.35, 0.12]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Holographic Speech Bubble during Demonstration */}
        {isDemonstrating && (
          <Html position={[0, 2.1, 0]} center distanceFactor={7} className="pointer-events-none select-none">
            <div className="bg-emerald-950/95 border border-emerald-400 p-2 rounded-xl shadow-xl text-center w-[190px] font-mono text-emerald-200 text-[9px] animate-bounce">
              <span className="font-bold text-white block mb-0.5">Assistance Active</span>
              "Dr. Vance STEM Lab #4 notes synced. Wayfinding guide beamed to your tablet!"
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};
