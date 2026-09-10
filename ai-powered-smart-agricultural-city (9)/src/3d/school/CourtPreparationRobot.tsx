import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { CourtPrepStage, SportType } from './SchoolTypes';

interface CourtPreparationRobotProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  selectedSport: SportType;
  isNight?: boolean;
}

export const CourtPreparationRobot: React.FC<CourtPreparationRobotProps> = ({
  onSelectNode,
  selectedSport,
  isNight = false,
}) => {
  const [prepStage, setPrepStage] = useState<CourtPrepStage>('IDLE');
  const [prepProgress, setPrepProgress] = useState(0);

  const robotGroupRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);

  // Automated Preparation Sequence timer
  useEffect(() => {
    let timer: any;
    if (prepStage === 'GAME_SELECTED') {
      timer = setTimeout(() => setPrepStage('PREPARING_COURT'), 1800);
    } else if (prepStage === 'PREPARING_COURT') {
      timer = setTimeout(() => setPrepStage('MARKING_FIELD'), 2200);
    } else if (prepStage === 'MARKING_FIELD') {
      timer = setTimeout(() => setPrepStage('PLACING_EQUIPMENT'), 2500);
    } else if (prepStage === 'PLACING_EQUIPMENT') {
      timer = setTimeout(() => setPrepStage('COURT_READY'), 2200);
    }
    return () => clearTimeout(timer);
  }, [prepStage]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (robotGroupRef.current) {
      if (prepStage === 'PREPARING_COURT' || prepStage === 'MARKING_FIELD' || prepStage === 'PLACING_EQUIPMENT') {
        // Patrol path around the court (perimeter loop)
        const angle = t * 1.5;
        const rx = 23 + Math.cos(angle) * 3.0;
        const rz = 4.5 + Math.sin(angle) * 2.2;
        robotGroupRef.current.position.set(rx, 0.25, rz);
        robotGroupRef.current.rotation.y = -angle + Math.PI / 2;

        if (laserBeamRef.current && prepStage === 'MARKING_FIELD') {
          laserBeamRef.current.visible = true;
          laserBeamRef.current.scale.set(1, 1 + Math.sin(t * 10) * 0.2, 1);
        } else if (laserBeamRef.current) {
          laserBeamRef.current.visible = false;
        }
      } else {
        // Idle station near court perimeter
        robotGroupRef.current.position.set(24.5, 0.25, 4.5);
        robotGroupRef.current.rotation.y = 0;
        if (laserBeamRef.current) {
          laserBeamRef.current.visible = false;
        }
      }
    }
  });

  const handleStartPreparation = () => {
    setPrepStage('GAME_SELECTED');
    onSelectNode({
      id: 'court-prep-robot-01',
      name: 'Autonomous Laser Field & Court Preparation Robot (ROBO-LINER-X)',
      category: 'Smart Sports Grounds Automation',
      status: 'active',
      efficiency: 99.8,
      powerKw: 0.65,
      description:
        'Self-guided omni-wheel surface conditioning rover with sub-millimeter RTK GPS laser line-painting, turf brushing, and automatic net tensioning mechanics.',
      telemetryFields: [
        { label: 'Preparation Stage', value: prepStage.replace('_', ' ') },
        { label: 'Target Sport', value: selectedSport },
        { label: 'Marking Accuracy', value: '±0.8 mm Laser Deviation' },
        { label: 'Line Compound', value: 'Eco-Degradable Fluorescent Chalk' },
      ],
    });
  };

  return (
    <group>
      {/* ROBOT ROVER */}
      <group
        ref={robotGroupRef}
        position={[24.5, 0.25, 4.5]}
        onClick={(e) => {
          e.stopPropagation();
          handleStartPreparation();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Chassis */}
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.35, 0.65]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 4 Heavy-duty Omni Wheels */}
        {[-0.38, 0.38].map((wx, wIdx) =>
          [-0.28, 0.28].map((wz, zIdx) => (
            <mesh
              key={`wheel-${wIdx}-${zIdx}`}
              position={[wx, -0.12, wz]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          ))
        )}

        {/* Laser Line Projector Head */}
        <mesh position={[0.35, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>

        {/* Laser Beam projection downwards to court surface */}
        <mesh
          ref={laserBeamRef}
          position={[0.35, -0.15, 0]}
          rotation={[0, 0, 0]}
          visible={false}
        >
          <cylinderGeometry args={[0.02, 0.08, 0.45, 8]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.8} />
        </mesh>

        {/* Chalk Reservoir Drum */}
        <mesh position={[-0.2, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.45, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.4} />
        </mesh>

        {/* 3D Floating Status HUD */}
        <Html position={[0, 1.3, 0]} center distanceFactor={8} className="pointer-events-auto select-none">
          <div className="bg-slate-950/95 border border-sky-400/80 p-2.5 rounded-xl shadow-2xl text-left w-[240px] backdrop-blur-md font-mono text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span className="text-[10px] font-bold text-sky-400 uppercase">
                AUTO COURT PREPARATION
              </span>
              <span className="text-[8px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-300 font-bold border border-sky-800">
                {prepStage === 'IDLE' ? 'READY' : 'ACTIVE'}
              </span>
            </div>

            {/* Sequence Stage Display */}
            <div className="space-y-1 mb-2 text-[8.5px]">
              <div
                className={`px-2 py-0.5 rounded flex items-center justify-between ${
                  prepStage === 'GAME_SELECTED'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50'
                    : 'text-slate-400'
                }`}
              >
                <span>1. GAME SELECTED</span>
                <span className="text-white font-bold">{selectedSport}</span>
              </div>
              <div
                className={`px-2 py-0.5 rounded ${
                  prepStage === 'PREPARING_COURT'
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                    : 'text-slate-400'
                }`}
              >
                2. PREPARING COURT
              </div>
              <div
                className={`px-2 py-0.5 rounded ${
                  prepStage === 'MARKING_FIELD'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50'
                    : 'text-slate-400'
                }`}
              >
                3. MARKING FIELD (LASER ACTIVE)
              </div>
              <div
                className={`px-2 py-0.5 rounded ${
                  prepStage === 'PLACING_EQUIPMENT'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/50'
                    : 'text-slate-400'
                }`}
              >
                4. PLACING EQUIPMENT
              </div>
              <div
                className={`px-2 py-0.5 rounded ${
                  prepStage === 'COURT_READY'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-slate-400'
                }`}
              >
                5. COURT READY &bull; MATCH READY!
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartPreparation();
              }}
              className="w-full py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-[9px] uppercase tracking-wider transition-all shadow text-center"
            >
              {prepStage === 'IDLE' || prepStage === 'COURT_READY'
                ? `PREPARE ${selectedSport.toUpperCase()} COURT`
                : 'PREPARATION IN PROGRESS...'}
            </button>
          </div>
        </Html>
      </group>

      {/* Equipment Deployed during or after PLACING_EQUIPMENT */}
      {(prepStage === 'PLACING_EQUIPMENT' || prepStage === 'COURT_READY') && (
        <group position={[25, 0, 2]}>
          {/* Orange Cones */}
          {[-1.5, 0, 1.5].map((cx, cIdx) => (
            <mesh key={`cone-${cIdx}`} position={[cx, 0.15, 0]}>
              <coneGeometry args={[0.14, 0.3, 8]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
