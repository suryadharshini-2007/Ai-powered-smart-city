import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { ViolationRecord } from './TrafficTypes';

interface AiViolationScreenProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  activeViolation?: ViolationRecord | null;
  isNight?: boolean;
}

const DEFAULT_VIOLATION: ViolationRecord = {
  id: 'VIO-4582',
  vehiclePlate: 'TN 09 BX 4582',
  vehicleType: 'EV Motorcycle',
  violation: 'No Helmet / Red Light Violation',
  speed: '72 km/h',
  confidence: 96,
  status: 'Recorded',
  timestamp: 'Just now',
};

export const AiViolationScreen: React.FC<AiViolationScreenProps> = ({
  onSelectNode,
  activeViolation,
  isNight = false,
}) => {
  const [currentRecord, setCurrentRecord] = useState<ViolationRecord>(DEFAULT_VIOLATION);
  const [flashTrigger, setFlashTrigger] = useState(false);

  // When parent passes a new active violation (e.g. from OVERSPEED or NO_HELMET simulation), update with flash
  useEffect(() => {
    if (activeViolation) {
      setCurrentRecord(activeViolation);
      setFlashTrigger(true);
      const timer = setTimeout(() => setFlashTrigger(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeViolation]);

  // Periodic cycle of simulated detections if idle
  useEffect(() => {
    if (activeViolation) return;
    const records: ViolationRecord[] = [
      {
        id: 'VIO-4582',
        vehiclePlate: 'TN 09 BX 4582',
        vehicleType: 'EV Two-Wheeler',
        violation: 'No Helmet / Red Light Violation',
        speed: '72 km/h (Limit: 40)',
        confidence: 96,
        status: 'Recorded',
        timestamp: '10s ago',
      },
      {
        id: 'VIO-8819',
        vehiclePlate: 'TN 74 AE 8819',
        vehicleType: 'Sedan EV',
        violation: 'Overspeed in Urban Corridor',
        speed: '86 km/h (Limit: 40)',
        confidence: 98,
        status: 'Challan Dispatched',
        timestamp: '42s ago',
      },
      {
        id: 'VIO-3021',
        vehiclePlate: 'KL 01 CG 3021',
        vehicleType: 'Logistics Van',
        violation: 'Zebra Crossing Encroachment',
        speed: '34 km/h',
        confidence: 94,
        status: 'Recorded',
        timestamp: '1m ago',
      },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % records.length;
      setCurrentRecord(records[idx]);
    }, 7000);

    return () => clearInterval(interval);
  }, [activeViolation]);

  const handleSelect = () => {
    onSelectNode({
      id: 'ai-violation-screen-01',
      name: 'AI Smart Traffic Violation Screen',
      category: 'Enforcement & Surveillance',
      status: 'optimal',
      efficiency: 99.7,
      powerKw: 0.85,
      description: 'Physical outdoor dynamic LED billboard powered by deep neural edge inference. Captures real-time license plates, speeds, rider helmet compliance, and automatically dispatches electronic challans.',
      telemetryFields: [
        { label: 'Vehicle Detected', value: 'YES' },
        { label: 'License Plate', value: currentRecord.vehiclePlate },
        { label: 'Infraction Type', value: currentRecord.violation },
        { label: 'Tracked Speed', value: currentRecord.speed },
        { label: 'AI Confidence', value: `${currentRecord.confidence}%` },
        { label: 'Prosecution Status', value: currentRecord.status },
      ],
    });
  };

  return (
    <group
      position={[-11, 0, 14]}
      rotation={[0, Math.PI / 4, 0]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Heavy Foundation Concrete Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.5, 1.2]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Dual Structural Steel Support Columns */}
      <mesh position={[-1.4, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 4.5, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.4, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 4.5, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Diagonal Support Bracing */}
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.07, 0.07, 3.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.07, 0.07, 3.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* Main Billboard Housing Case */}
      <group position={[0, 5.2, 0]}>
        {/* Outer Frame Bezel */}
        <mesh castShadow>
          <boxGeometry args={[4.8, 3.2, 0.35]} />
          <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Flashing Alert Border LED Trim */}
        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[4.7, 3.1, 0.02]} />
          <meshStandardMaterial
            color={flashTrigger ? '#ef4444' : '#0284c7'}
            emissive={flashTrigger ? '#ef4444' : '#0284c7'}
            emissiveIntensity={flashTrigger ? 3 : 0.8}
          />
        </mesh>

        {/* High-Resolution Screen Face */}
        <mesh position={[0, 0, 0.2]}>
          <planeGeometry args={[4.4, 2.8]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* 3D HTML Screen Interface (crisp, scalable, and responsive) */}
        <Html
          position={[0, 0, 0.22]}
          transform
          occlude
          distanceFactor={4.5}
          className="pointer-events-none select-none"
        >
          <div
            className={`w-[360px] p-3 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 ${
              flashTrigger
                ? 'bg-rose-950/95 border-rose-500 shadow-rose-500/50'
                : 'bg-slate-950/95 border-sky-500/80 shadow-sky-500/20'
            }`}
          >
            {/* Top Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase">
                  AI VIOLATION RADAR
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                LIVE JUNCTION CAM
              </span>
            </div>

            {/* Vehicle Detection Headline */}
            <div className="flex items-center justify-between bg-slate-900/80 rounded px-2 py-1 mb-2 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                Vehicle Detected:
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wide">
                CONFIRMED (ANPR-360)
              </span>
            </div>

            {/* License Plate Banner */}
            <div className="bg-amber-400/90 text-slate-950 font-mono font-black text-base text-center py-1.5 rounded tracking-widest mb-2 shadow-inner border border-amber-300">
              {currentRecord.vehiclePlate}
            </div>

            {/* Violation Details Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono mb-2">
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">VIOLATION:</span>
                <span className="font-bold text-rose-400 leading-tight block">
                  {currentRecord.violation}
                </span>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">SPEED:</span>
                <span className="font-bold text-amber-300 leading-tight block">
                  {currentRecord.speed}
                </span>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">AI CONFIDENCE:</span>
                <span className="font-bold text-sky-300 block">
                  {currentRecord.confidence}%
                </span>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">STATUS:</span>
                <span className="font-bold text-emerald-400 uppercase block">
                  {currentRecord.status}
                </span>
              </div>
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
              <span>DEVICE: VIO-CAM-04</span>
              <span>{currentRecord.timestamp}</span>
              <span className="text-emerald-400">CLICK TO INSPECT</span>
            </div>
          </div>
        </Html>

        {/* Solar Panel Hood on top of the Billboard */}
        <group position={[0, 1.8, 0]} rotation={[Math.PI / 8, 0, 0]}>
          <mesh>
            <boxGeometry args={[4.9, 0.05, 1.2]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
