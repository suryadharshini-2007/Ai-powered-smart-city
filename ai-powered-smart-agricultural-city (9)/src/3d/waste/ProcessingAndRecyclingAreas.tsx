import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Leaf, Boxes, FileText, Flame, Layers } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface ProcessingAndRecyclingAreasProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const ProcessingAndRecyclingAreas: React.FC<ProcessingAndRecyclingAreasProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const digesterMixerRef = useRef<THREE.Mesh>(null);
  const flareGlowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (digesterMixerRef.current) {
      digesterMixerRef.current.rotation.y = t * 0.4;
    }
    if (flareGlowRef.current) {
      flareGlowRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. ORGANIC PROCESSING AREA (NORTH-WEST SECTOR) */}
      {/* ========================================================= */}
      <group
        position={[-8.5, 0, -8.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'waste-organic-reactor',
            name: 'Thermophilic Anaerobic Bio-Digestion & Composting Complex',
            category: 'Organic Waste Processing',
            status: 'optimal',
            efficiency: 98.4,
            powerKw: 110,
            description:
              'Biochemically digests agricultural and food waste into clean biomethane gas and nutrient-rich liquid digestate for vertical farming hydroponic lines.',
            telemetryFields: [
              { label: 'Digester Temp', value: '55.2 °C Optimal' },
              { label: 'Biomethane Purity', value: '98.5% CH4' },
              { label: 'Compost Production', value: '1.45 tons / day' },
              { label: 'Odor Neutralization', value: '100% Bio-Filtered' },
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
        {/* Reinforced Base Foundation */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[4.2, 4.4, 0.2, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Primary Bio-Digester Tank */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[3.2, 3.2, 4.6, 24]} />
          <meshStandardMaterial
            color={isNight ? '#064e3b' : '#059669'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Inflatable Spherical Methane Membrane Cap */}
        <mesh position={[0, 4.8, 0]}>
          <sphereGeometry args={[3.2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#10b981"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Biomethane Extraction Pipe Column */}
        <mesh position={[2.5, 3.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 7.0, 12]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} />
        </mesh>

        {/* Micro-Flare safety glow */}
        <pointLight ref={flareGlowRef} position={[2.5, 7.2, 0]} color="#f59e0b" distance={6} />

        {/* Floating Sector Label */}
        <Html position={[0, 6.2, 0]} center distanceFactor={9} className="pointer-events-none select-none">
          <div className="bg-emerald-950/90 border border-emerald-400 px-3 py-1 rounded-xl text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            ORGANIC PROCESSING & BIO-DIGESTER
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 2. RECYCLING AREA: PLASTIC SECTION (NORTH SECTOR) */}
      {/* ========================================================= */}
      <group
        position={[0, 0, -10.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'waste-plastic-refinery',
            name: 'High-Purity Polymer Shredding & Pelletizing Plant',
            category: 'Plastic Recycling',
            status: 'optimal',
            efficiency: 97.8,
            powerKw: 85,
            description:
              'Automated optical sorting, wash-flaking, and decontamination unit converting post-consumer PET and HDPE into food-grade circular filament and packaging resin.',
            telemetryFields: [
              { label: 'Optical Purity', value: '99.4% Flake Grade' },
              { label: 'Extrusion Temp', value: '235 °C' },
              { label: 'Daily Pellet Output', value: '1.2 tons / day' },
              { label: 'Polymer Streams', value: 'PET / HDPE / PP' },
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
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[5.2, 0.2, 4.0]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Dual Flake Silos */}
        {[-1.4, 1.4].map((sx, sIdx) => (
          <group key={`plastic-silo-${sIdx}`} position={[sx, 2.5, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[1.0, 1.0, 4.6, 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <coneGeometry args={[1.0, 0.8, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Extruder Housing in Middle */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.4, 2.2, 2.8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Floating Sector Label */}
        <Html position={[0, 5.2, 0]} center distanceFactor={9} className="pointer-events-none select-none">
          <div className="bg-amber-950/90 border border-amber-400 px-3 py-1 rounded-xl text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap">
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            PLASTIC REFINERY & PELLETIZING
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* 3. RECYCLING AREA: PAPER & CARDBOARD SECTION (NORTH-EAST SECTOR) */}
      {/* ========================================================= */}
      <group
        position={[8.5, 0, -8.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'waste-paper-baler',
            name: 'High-Density Hydraulic Paper Baling & Pulping Plant',
            category: 'Paper & Cellulose Recycling',
            status: 'optimal',
            efficiency: 99.0,
            powerKw: 65,
            description:
              'Hydraulic ram compaction and de-inking pulping system generating zero-bleach recycled shipping cartons and molded fiber farm trays.',
            telemetryFields: [
              { label: 'Ram Pressure', value: '240 bar' },
              { label: 'Bale Density', value: '620 kg/m³' },
              { label: 'Water Recycling', value: '98.8% Closed Loop' },
              { label: 'Cellulose Yield', value: '865 kg / day' },
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
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[4.8, 0.2, 4.0]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Hydraulic Press Enclosure */}
        <mesh position={[-0.8, 1.8, 0]} castShadow>
          <boxGeometry args={[2.5, 3.4, 2.6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Stack of Finished Compressed Bales */}
        {[
          [1.4, 0.5, -0.6],
          [1.4, 0.5, 0.6],
          [1.4, 1.4, 0],
        ].map(([bx, by, bz], bIdx) => (
          <mesh key={`bale-${bIdx}`} position={[bx, by, bz]} castShadow>
            <boxGeometry args={[1.0, 0.8, 1.0]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.8} />
          </mesh>
        ))}

        {/* Floating Sector Label */}
        <Html position={[0, 4.8, 0]} center distanceFactor={9} className="pointer-events-none select-none">
          <div className="bg-sky-950/90 border border-sky-400 px-3 py-1 rounded-xl text-[10px] font-mono text-sky-300 font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            PAPER & CELLULOSE RECYCLING
          </div>
        </Html>
      </group>
    </group>
  );
};
