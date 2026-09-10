import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { ClassroomScreenMode } from './SchoolTypes';

interface SmartClassroomProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  screenMode: ClassroomScreenMode;
  onCycleScreenMode: () => void;
  isNight?: boolean;
}

export const SmartClassroom: React.FC<SmartClassroomProps> = ({
  onSelectNode,
  screenMode,
  onCycleScreenMode,
  isNight = false,
}) => {
  const teacherArmRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  // Student desk positions in 2 rows of 3 desks
  const studentDesks = [
    { x: -2.0, z: 0.5, name: 'Aarav (Student #1)' },
    { x: 0, z: 0.5, name: 'Diya (Student #2)' },
    { x: 2.0, z: 0.5, name: 'Rohan (Student #3)' },
    { x: -2.0, z: 2.6, name: 'Ananya (Student #4)' },
    { x: 0, z: 2.6, name: 'Vikram (Student #5)' },
    { x: 2.0, z: 2.6, name: 'Priya (Student #6)' },
  ];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Teacher gesturing subtly
    if (teacherArmRef.current) {
      teacherArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(t * 2) * 0.15;
    }
    // Rotating 3D diagram element on screen
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = t * 1.5;
    }
  });

  const handleSelectClassroom = () => {
    onSelectNode({
      id: 'smart-classroom-01',
      name: 'Interactive AI-Empowered Smart Classroom',
      category: 'Smart Pedagogy & STEM Education',
      status: 'active',
      efficiency: 98.9,
      powerKw: 3.2,
      description:
        'Next-generation adaptive learning classroom featuring bi-directional holographic smart display, real-time student neural focus telemetry, and AI-assisted personalized curriculum pacing.',
      telemetryFields: [
        { label: 'Screen Mode', value: screenMode.replace('_', ' ') },
        { label: 'Students Present', value: '28 / 28' },
        { label: 'Attention Index', value: '94%' },
        { label: 'Teacher', value: 'Dr. Evelyn Vance (Senior STEM Fellow)' },
      ],
    });
  };

  const handleSelectScreen = (e: any) => {
    e.stopPropagation();
    onCycleScreenMode();
    handleSelectClassroom();
  };

  return (
    <group
      position={[-7, 1.2, -8]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelectClassroom();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Classroom Room Floor */}
      <mesh position={[0, -0.05, 0.5]} receiveShadow>
        <boxGeometry args={[7.2, 0.1, 7.5]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Back Wall with Large Smart Screen */}
      <mesh position={[0, 1.8, -3.1]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 3.8, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-3.5, 1.8, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3.8, 7.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* 2. THE LARGE INTERACTIVE SMART SCREEN */}
      <group position={[0, 2.1, -2.95]} onClick={handleSelectScreen}>
        {/* Outer Bezel Frame */}
        <mesh castShadow>
          <boxGeometry args={[4.4, 2.4, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Display Surface with Dynamic Glow */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[4.2, 2.2]} />
          <meshStandardMaterial
            color={
              screenMode === 'DIGITAL_LESSON'
                ? '#0284c7'
                : screenMode === 'AI_CONTENT'
                ? '#9333ea'
                : screenMode === 'INTERACTIVE_DIAGRAM'
                ? '#0d9488'
                : '#e11d48'
            }
            emissive={
              screenMode === 'DIGITAL_LESSON'
                ? '#0284c7'
                : screenMode === 'AI_CONTENT'
                ? '#9333ea'
                : screenMode === 'INTERACTIVE_DIAGRAM'
                ? '#0d9488'
                : '#e11d48'
            }
            emissiveIntensity={isNight ? 1.4 : 0.8}
          />
        </mesh>

        {/* 3D Orbit Ring diagram for INTERACTIVE_DIAGRAM mode */}
        {screenMode === 'INTERACTIVE_DIAGRAM' && (
          <group ref={orbitGroupRef} position={[0, 0, 0.15]}>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.65, 0.02, 16, 64]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.65, 0, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} />
            </mesh>
          </group>
        )}

        {/* Interactive Screen Overlay with DOM UI */}
        <Html
          position={[0, 0, 0.12]}
          transform
          distanceFactor={3.2}
          className="pointer-events-auto select-none"
        >
          <div
            onClick={handleSelectScreen}
            className="w-[420px] p-3.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-sky-400/50 text-white font-mono shadow-2xl cursor-pointer hover:border-sky-300 transition-all"
          >
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SMART DISPLAY &bull; {screenMode.replace('_', ' ')}
              </span>
              <span className="text-[9px] bg-sky-950 px-2 py-0.5 rounded text-sky-300 border border-sky-800">
                CLICK TO SWITCH MODE
              </span>
            </div>

            {/* Mode 1: DIGITAL LESSON */}
            {screenMode === 'DIGITAL_LESSON' && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-sky-200">
                  Topic: Quantum Photovoltaics & Clean Energy
                </div>
                <div className="text-[10px] text-slate-300">
                  Chapter 4: Electron excitation in semiconductor p-n junctions and solar harvesting.
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-sky-500 h-full w-[72%]" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                  <span>Lesson Progress: 72%</span>
                  <span>Next: Nanotube Collectors</span>
                </div>
              </div>
            )}

            {/* Mode 2: AI CONTENT */}
            {screenMode === 'AI_CONTENT' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    Generative AI Curriculum Synthesis
                  </span>
                  <span className="text-[9px] bg-purple-900/80 px-1.5 py-0.5 rounded text-purple-200">
                    Active
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 leading-snug">
                  Adaptive AI tutor generating custom 3D simulation models for student group B based on real-time comprehension telemetry.
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-purple-200 pt-1">
                  <div className="bg-purple-950/60 p-1 rounded border border-purple-800">
                    Personalized Pace: +18%
                  </div>
                  <div className="bg-purple-950/60 p-1 rounded border border-purple-800">
                    Concept Retention: 95.4%
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: INTERACTIVE DIAGRAM */}
            {screenMode === 'INTERACTIVE_DIAGRAM' && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-teal-300">
                  Interactive Orbital Mechanics Simulation
                </div>
                <div className="text-[10px] text-slate-300">
                  Real-time physics engine calculating Lagrange points & gravitational slingshot vectors.
                </div>
                <div className="flex items-center gap-2 text-[9px] text-teal-200 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-teal-950 border border-teal-800">
                    Velocity: 29.8 km/s
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-teal-950 border border-teal-800">
                    Semi-Major Axis: 1.000 AU
                  </span>
                </div>
              </div>
            )}

            {/* Mode 4: STUDENT ANALYTICS */}
            {screenMode === 'STUDENT_ANALYTICS' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">
                    Live Classroom Neural Engagement
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">ALL OPTIMAL</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[9px]">
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    <div className="text-slate-400">Attention</div>
                    <div className="font-bold text-emerald-400 text-[11px]">94%</div>
                  </div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    <div className="text-slate-400">Comprehension</div>
                    <div className="font-bold text-sky-400 text-[11px]">91%</div>
                  </div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    <div className="text-slate-400">Quiz Accuracy</div>
                    <div className="font-bold text-purple-400 text-[11px]">89%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom 4-Button Mode Bar */}
            <div className="grid grid-cols-4 gap-1 mt-2.5 pt-1.5 border-t border-slate-800 text-[8px] font-bold text-center">
              <div
                className={`py-0.5 rounded ${
                  screenMode === 'DIGITAL_LESSON'
                    ? 'bg-sky-500 text-white font-black'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                LESSON
              </div>
              <div
                className={`py-0.5 rounded ${
                  screenMode === 'AI_CONTENT'
                    ? 'bg-purple-600 text-white font-black'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                AI CONTENT
              </div>
              <div
                className={`py-0.5 rounded ${
                  screenMode === 'INTERACTIVE_DIAGRAM'
                    ? 'bg-teal-600 text-white font-black'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                DIAGRAM
              </div>
              <div
                className={`py-0.5 rounded ${
                  screenMode === 'STUDENT_ANALYTICS'
                    ? 'bg-rose-600 text-white font-black'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                ANALYTICS
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* 3. Teacher Standing at Front Podium */}
      <group position={[1.8, 0, -1.8]}>
        {/* Podium Desk */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.9, 1.1, 0.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        {/* Holographic Tablet on Podium */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.3]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>

        {/* Teacher Human Model */}
        <group position={[0, 0, 0.5]}>
          {/* Torso */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.36, 0.65, 0.22]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          {/* Animated Gesturing Arm */}
          <group ref={teacherArmRef} position={[-0.24, 1.45, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[0.1, 0.44, 0.1]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
          {/* Legs */}
          <mesh position={[-0.1, 0.45, 0]}>
            <boxGeometry args={[0.12, 0.9, 0.14]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.1, 0.45, 0]}>
            <boxGeometry args={[0.12, 0.9, 0.14]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>

      {/* 4. Student Desks & Students */}
      {studentDesks.map((desk, idx) => (
        <group key={`student-desk-${idx}`} position={[desk.x, 0, desk.z]}>
          {/* Modern Student Desk */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.3, 0.85, 0.7]} />
            <meshStandardMaterial color="#475569" roughness={0.3} />
          </mesh>
          {/* Student Laptop / Digital Notebook */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.35, 0.02, 0.25]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Laptop Screen */}
          <mesh position={[0, 1.02, -0.12]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.35, 0.22, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>

          {/* Student Sitting on Chair */}
          <group position={[0, 0, 0.65]}>
            {/* Chair */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[0.3, 0.5, 0.2]} />
              <meshStandardMaterial
                color={
                  idx % 3 === 0
                    ? '#10b981'
                    : idx % 3 === 1
                    ? '#f59e0b'
                    : '#ec4899'
                }
              />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.12, 0]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color="#fed7aa" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};
