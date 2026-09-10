import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Cpu,
  Layers,
  ArrowRight,
  Leaf,
  Boxes,
  FileText,
  HelpCircle,
  Play,
  RotateCw,
  PlusCircle,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SegregationStage, SortingWasteItem } from './WasteTypes';
import { wasteSounds } from './WasteSounds';

interface WasteSegregationSystemProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const WasteSegregationSystem: React.FC<WasteSegregationSystemProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const [activeStage, setActiveStage] = useState<SegregationStage>('AI_CLASSIFICATION');
  const [conveyorSpeed, setConveyorSpeed] = useState<number>(1.0);

  // Animated sorting items moving along the conveyor
  const [items, setItems] = useState<SortingWasteItem[]>([
    { id: 1, type: 'organic', name: 'Bio-Crop Residue', progress: 0.15, color: '#10b981' },
    { id: 2, type: 'plastic', name: 'Polyethylene Bottle', progress: 0.45, color: '#f59e0b' },
    { id: 3, type: 'paper', name: 'Cellulose Packaging', progress: 0.72, color: '#0284c7' },
    { id: 4, type: 'other', name: 'Composite PCB Scrap', progress: 0.92, color: '#a855f7' },
  ]);

  const laserMeshRef = useRef<THREE.Mesh>(null);
  const scannerGlowRef = useRef<THREE.PointLight>(null);

  // Animate items moving along the conveyor and loop them
  useFrame((_, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        let newProgress = item.progress + delta * 0.18 * conveyorSpeed;
        if (newProgress > 1.0) {
          // Wrap around with random new waste category
          const types: ('organic' | 'plastic' | 'paper' | 'other')[] = [
            'organic',
            'plastic',
            'paper',
            'other',
          ];
          const nextType = types[Math.floor(Math.random() * types.length)];
          const names = {
            organic: 'Agricultural Waste',
            plastic: 'PET Bottle',
            paper: 'Cardboard Box',
            other: 'Mixed Synthetic',
          };
          const colors = {
            organic: '#10b981',
            plastic: '#f59e0b',
            paper: '#0284c7',
            other: '#a855f7',
          };
          newProgress = 0;
          return {
            ...item,
            type: nextType,
            name: names[nextType],
            color: colors[nextType],
            progress: newProgress,
          };
        }

        // Check if item is in AI scanning zone (around progress 0.35 - 0.45)
        if (item.progress < 0.4 && newProgress >= 0.4) {
          wasteSounds.playClassificationPing();
        }

        return { ...item, progress: newProgress };
      })
    );

    // Scanner beam pulsing
    if (laserMeshRef.current) {
      const t = Date.now() * 0.005;
      laserMeshRef.current.scale.y = 1 + Math.sin(t) * 0.25;
    }
  });

  const injectNewItem = () => {
    wasteSounds.playClassificationPing();
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'organic',
        name: 'Fresh Harvest Biomass',
        progress: 0.02,
        color: '#10b981',
      },
    ]);
  };

  return (
    <group
      position={[0, 0, -3.5]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode({
          id: 'waste-segregation-core',
          name: 'Hyper-Spectral AI Waste Segregation & Diverter Line',
          category: 'Automated Materials Recovery Facility (MRF)',
          status: 'optimal',
          efficiency: 99.4,
          powerKw: 18.5,
          description:
            'Deep learning multi-camera optical sorter with pneumatic jet diverters. Classifies up to 1,200 items per minute into 4 segregated pure feedstock streams.',
          telemetryFields: [
            { label: 'Sorting Accuracy', value: '99.8%' },
            { label: 'Conveyor Velocity', value: `${(1.2 * conveyorSpeed).toFixed(1)} m/s` },
            { label: 'Current Process', value: 'WASTE INPUT → AI SCAN → 4-STREAM CHUTE' },
            { label: 'Throughput', value: '3.4 tons / hour' },
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
      {/* ========================================================= */}
      {/* 1. CONVEYOR BELT BED & STRUCTURAL STEEL LEGS */}
      {/* ========================================================= */}
      {/* Support pillars */}
      {[-4.5, -1.5, 1.5, 4.5].map((px, pIdx) => (
        <group key={`leg-${pIdx}`} position={[px, 0.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 1.6, 1.8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Main Conveyor Bed (Length = 11m, Height = 1.6m, Width = 1.6m) */}
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[11.5, 0.25, 1.6]} />
        <meshStandardMaterial
          color={isNight ? '#0b1120' : '#1e293b'}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Rubber Moving Belt Surface */}
      <mesh position={[0, 1.79, 0]}>
        <boxGeometry args={[11.3, 0.04, 1.3]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* Guardrails */}
      <mesh position={[0, 1.95, -0.72]}>
        <boxGeometry args={[11.4, 0.25, 0.06]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.95, 0.72]}>
        <boxGeometry args={[11.4, 0.25, 0.06]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} />
      </mesh>

      {/* ========================================================= */}
      {/* 2. STAGE 1: WASTE INPUT HOPPER (LEFT END) */}
      {/* ========================================================= */}
      <group position={[-5.2, 2.5, 0]}>
        {/* Ingestion Funnel Hopper */}
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry args={[1.2, 0.6, 1.4, 4]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Hopper Intake Label */}
        <Html position={[0, 1.2, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-slate-950/90 border border-sky-500 px-2 py-0.5 rounded text-[8px] font-mono text-sky-300 font-bold whitespace-nowrap shadow-md">
            1. WASTE INPUT
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 3. STAGE 2: AI CLASSIFICATION SCANNER TUNNEL (MIDDLE-LEFT) */}
      {/* ========================================================= */}
      <group position={[-1.8, 2.3, 0]}>
        {/* Scanner Chamber Arch */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.4, 2.0]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Chamber Glass Viewing Windows */}
        <mesh position={[0, 0, 1.02]}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>

        {/* AI Multi-Spectral Laser Scanner Beam */}
        <mesh ref={laserMeshRef} position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.08, 1.2]} />
          <meshBasicMaterial
            color="#06b6d4"
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
        <pointLight ref={scannerGlowRef} position={[0, 0, 0]} color="#06b6d4" intensity={2} distance={4} />

        {/* Scanner Chamber Label */}
        <Html position={[0, 1.1, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-cyan-950/90 border border-cyan-400 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-300 font-bold flex items-center gap-1 shadow-lg animate-pulse whitespace-nowrap">
            <Cpu className="w-2.5 h-2.5" />
            2. AI CLASSIFICATION
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 4. STAGE 3: 4-STREAM PNEUMATIC DIVERTER CHUTES */}
      {/* ========================================================= */}
      {/* Diverter 1: ORGANIC (Green) */}
      <group position={[0.8, 1.2, -1.5]}>
        <mesh rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.2, 1.8]} />
          <meshStandardMaterial color="#10b981" metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, -0.8]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#064e3b" />
        </mesh>
        <Html position={[0, 0.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-emerald-950/90 border border-emerald-400 px-1.5 py-0.5 rounded text-[7px] font-mono text-emerald-300 font-bold whitespace-nowrap">
            ORGANIC
          </div>
        </Html>
      </group>

      {/* Diverter 2: PLASTIC (Amber) */}
      <group position={[2.2, 1.2, 1.5]}>
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.2, 1.8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, 0.8]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <Html position={[0, 0.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-amber-950/90 border border-amber-400 px-1.5 py-0.5 rounded text-[7px] font-mono text-amber-300 font-bold whitespace-nowrap">
            PLASTIC
          </div>
        </Html>
      </group>

      {/* Diverter 3: PAPER (Blue) */}
      <group position={[3.6, 1.2, -1.5]}>
        <mesh rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.2, 1.8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, -0.8]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#082f49" />
        </mesh>
        <Html position={[0, 0.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-sky-950/90 border border-sky-400 px-1.5 py-0.5 rounded text-[7px] font-mono text-sky-300 font-bold whitespace-nowrap">
            PAPER
          </div>
        </Html>
      </group>

      {/* Diverter 4: OTHER / ELECTRONICS (Purple) */}
      <group position={[5.0, 1.2, 1.5]}>
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.2, 1.8]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, 0.8]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#3b0764" />
        </mesh>
        <Html position={[0, 0.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-purple-950/90 border border-purple-400 px-1.5 py-0.5 rounded text-[7px] font-mono text-purple-300 font-bold whitespace-nowrap">
            OTHER
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 5. STAGE 4: RECYCLING & PROCESSING HOPPERS (RIGHT DISCHARGE) */}
      {/* ========================================================= */}
      <group position={[6.2, 1.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.8, 1.8]} />
          <meshStandardMaterial color="#059669" metalness={0.8} />
        </mesh>
        <Html position={[0, 1.2, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-emerald-950/90 border border-emerald-400 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-300 font-bold whitespace-nowrap shadow-lg">
            4. RECYCLING / PROCESSING
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 6. ANIMATED WASTE OBJECTS TRAVELING ALONG CONVEYOR */}
      {/* ========================================================= */}
      {items.map((item) => {
        // Position along the X axis from -5.0 (input) to +5.5 (discharge)
        const posX = -5.0 + item.progress * 10.5;
        let posY = 1.95;
        let posZ = 0;

        // If diverted past progress 0.65, simulate dropping into respective chutes
        if (item.progress > 0.65) {
          if (item.type === 'organic') {
            posZ = -((item.progress - 0.65) * 3.5);
            posY = 1.95 - (item.progress - 0.65) * 1.6;
          } else if (item.type === 'plastic') {
            posZ = (item.progress - 0.65) * 3.5;
            posY = 1.95 - (item.progress - 0.65) * 1.6;
          } else if (item.type === 'paper') {
            posZ = -((item.progress - 0.65) * 3.5);
            posY = 1.95 - (item.progress - 0.65) * 1.6;
          } else {
            posZ = (item.progress - 0.65) * 3.5;
            posY = 1.95 - (item.progress - 0.65) * 1.6;
          }
        }

        return (
          <group key={item.id} position={[posX, posY, posZ]}>
            {/* Visual shape depends on waste category */}
            {item.type === 'organic' && (
              <mesh castShadow>
                <sphereGeometry args={[0.18, 8, 8]} />
                <meshStandardMaterial color="#22c55e" roughness={0.7} />
              </mesh>
            )}
            {item.type === 'plastic' && (
              <mesh castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.35, 8]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  transparent
                  opacity={0.85}
                  metalness={0.9}
                />
              </mesh>
            )}
            {item.type === 'paper' && (
              <mesh castShadow>
                <boxGeometry args={[0.3, 0.2, 0.25]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.8} />
              </mesh>
            )}
            {item.type === 'other' && (
              <mesh castShadow>
                <boxGeometry args={[0.22, 0.15, 0.22]} />
                <meshStandardMaterial color="#a855f7" metalness={0.9} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* 7. 3D FLOATING SEGREGATION PROCESS BANNER OVERHEAD */}
      {/* ========================================================= */}
      <Html
        position={[0, 4.4, 0]}
        center
        distanceFactor={8}
        className="select-none pointer-events-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[500px] bg-slate-950/95 backdrop-blur-xl border border-teal-500/80 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(20,184,166,0.5)] font-mono text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Cpu className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wide">
                AUTOMATED SEGREGATION PIPELINE
              </span>
            </div>
            <button
              type="button"
              onClick={injectNewItem}
              className="px-2 py-0.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] flex items-center gap-1 transition-all"
            >
              <PlusCircle className="w-3 h-3" />
              FEED WASTE ITEM
            </button>
          </div>

          {/* Stepper Pipeline Flow */}
          <div className="flex items-center justify-between text-[9px] gap-1">
            {/* Step 1 */}
            <div className="flex-1 bg-slate-900 border border-slate-700 p-1.5 rounded-lg text-center font-bold text-slate-300">
              WASTE INPUT
            </div>
            <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />

            {/* Step 2 */}
            <div className="flex-1 bg-cyan-950 border border-cyan-500 p-1.5 rounded-lg text-center font-bold text-cyan-300 animate-pulse">
              AI CLASSIFICATION
            </div>
            <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />

            {/* Step 3 (4 Streams) */}
            <div className="flex-1 bg-slate-900 border border-slate-700 p-1 rounded-lg text-center">
              <div className="grid grid-cols-2 gap-0.5 text-[8px] font-bold">
                <span className="text-emerald-400">ORGANIC</span>
                <span className="text-amber-400">PLASTIC</span>
                <span className="text-sky-400">PAPER</span>
                <span className="text-purple-400">OTHER</span>
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />

            {/* Step 4 */}
            <div className="flex-1 bg-emerald-950 border border-emerald-500 p-1.5 rounded-lg text-center font-bold text-emerald-300">
              RECYCLING / PROCESSING
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
