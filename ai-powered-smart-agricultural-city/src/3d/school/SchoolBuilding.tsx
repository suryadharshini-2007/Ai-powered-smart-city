import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface SchoolBuildingProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SchoolBuilding: React.FC<SchoolBuildingProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const holoCoreRef = useRef<THREE.Mesh>(null);
  const robotArmRef = useRef<THREE.Group>(null);
  const vitalPulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // AI Lab holographic processor rotation
    if (holoCoreRef.current) {
      holoCoreRef.current.rotation.y = t * 1.2;
      holoCoreRef.current.rotation.x = Math.sin(t * 0.8) * 0.3;
    }

    // Robotics Lab articulated arm rotation
    if (robotArmRef.current) {
      robotArmRef.current.rotation.y = Math.sin(t * 2) * 0.6;
    }

    // Medical room vital monitor pulse
    if (vitalPulseRef.current) {
      const s = 1 + Math.sin(t * 5) * 0.15;
      vitalPulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, -8]}>
      {/* ========================================================= */}
      {/* 1. MAIN BUILDING ARCHITECTURAL STRUCTURE */}
      {/* ========================================================= */}
      {/* Central Grand Academic Atrium */}
      <group
        position={[0, 4.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'school-central-atrium',
            name: 'Smart School Grand Academic Atrium',
            category: 'Campus Architecture',
            status: 'optimal',
            efficiency: 99.1,
            powerKw: 14.5,
            description:
              'Architectural heart of the Smart School featuring triple-glazed low-E photovoltaic skylights, passive stack-ventilation thermal chimneys, and multi-tier collaborative learning concourses.',
            telemetryFields: [
              { label: 'Air Exchange', value: '4.2 ACH (HEPA Filtered)' },
              { label: 'Natural Daylight Factor', value: '78% Passive' },
              { label: 'Campus Capacity', value: '1,800 Students & Faculty' },
              { label: 'Acoustic Rating', value: 'NC-25 Ultra-Quiet' },
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
        {/* Main Atrium Glass Tower */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14, 8.4, 11]} />
          <meshStandardMaterial
            color={isNight ? '#0f172a' : '#1e293b'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Curved Glass Front Facade Curtain Wall */}
        <mesh position={[0, 0, 5.6]}>
          <planeGeometry args={[13.2, 7.8]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Entrance Overhang Canopy */}
        <mesh position={[0, -2.4, 7.5]} castShadow>
          <boxGeometry args={[8.5, 0.4, 4.0]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      </group>

      {/* West Wing (Classrooms, AI Lab, Robotics Lab, Computer Lab) */}
      <group position={[-14, 3.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14, 7.6, 10]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Continuous Ribbon Windows */}
        <mesh position={[0, 0.5, 5.05]}>
          <planeGeometry args={[13.4, 4.8]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* East Wing (Science Lab, Library, Medical Room, Indoor Gaming, AI Reception) */}
      <group position={[14, 3.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14, 7.6, 10]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Ribbon Windows */}
        <mesh position={[0, 0.5, 5.05]}>
          <planeGeometry args={[13.4, 4.8]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 2. SPECIFIC REQUIRED SPECIALTY FACILITIES (CLICKABLE) */}
      {/* ========================================================= */}

      {/* --- A. AI LABORATORY --- */}
      <group
        position={[-16, 1.2, 2.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-ai-lab',
            name: 'Advanced Neural AI & Machine Learning Laboratory',
            category: 'Advanced STEM Research',
            status: 'active',
            efficiency: 99.4,
            powerKw: 8.4,
            description:
              'Dedicated student artificial intelligence proving lab equipped with tensor-processing supercomputing clusters, transformer model fine-tuning sandboxes, and holographic neural architecture visualizers.',
            telemetryFields: [
              { label: 'Compute Cluster', value: '64x Tensor Neural Nodes' },
              { label: 'Active Neural Models', value: '18 Student Projects' },
              { label: 'Model Accuracy', value: '98.6% (Computer Vision)' },
              { label: 'Cooling Loop', value: 'Closed-Loop Liquid Glycol 18°C' },
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
        {/* Lab Pod Room Floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Server Rack Cluster */}
        <mesh position={[-1.4, 1.1, -1.2]} castShadow>
          <boxGeometry args={[0.9, 2.2, 0.9]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* Central Holographic Neural Core */}
        <group position={[0, 1.1, 0]}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.7, 0.8, 0.3, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh ref={holoCoreRef}>
            <octahedronGeometry args={[0.45]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
        {/* Label Tag */}
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-purple-950/90 border border-purple-400 px-2 py-0.5 rounded text-[8px] font-mono text-purple-200 font-bold">
            AI LABORATORY
          </div>
        </Html>
      </group>

      {/* --- B. ROBOTICS LABORATORY --- */}
      <group
        position={[-16, 1.2, -2.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-robotics-lab',
            name: 'Autonomous Robotics & Mechatronics Prototyping Lab',
            category: 'Engineering & Fabrication',
            status: 'active',
            efficiency: 97.9,
            powerKw: 6.2,
            description:
              'Rapid prototyping arena outfitted with 6-axis articulated robotic arms, LiDAR test benches, quadruped robot testing obstacle courses, and automated soldering extractors.',
            telemetryFields: [
              { label: 'Articulated Arms', value: '6 Industrial Fanuc-Edu Bots' },
              { label: 'Ground Rovers Tested', value: '12 Autonomous Units' },
              { label: '3D Printers', value: '8 Continuous Carbon Fibre' },
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
        {/* Floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Workbench */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.4, 0.9, 1.4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Articulated Robotic Arm */}
        <group ref={robotArmRef} position={[0, 0.9, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.4, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
          <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.1, 0.5, 0.1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          {/* End Effector Tool */}
          <mesh position={[0.4, 0.65, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
          </mesh>
        </group>
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-amber-950/90 border border-amber-400 px-2 py-0.5 rounded text-[8px] font-mono text-amber-200 font-bold">
            ROBOTICS LAB
          </div>
        </Html>
      </group>

      {/* --- C. COMPUTER LABORATORY --- */}
      <group
        position={[-11, 4.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-computer-lab',
            name: 'Next-Gen Cybersecurity & Quantum Computing Lab',
            category: 'Computer Science',
            status: 'active',
            efficiency: 99.0,
            powerKw: 5.1,
            description:
              'High-throughput computer science laboratory equipped with 40 curved OLED workstations, high-speed fiber interconnects, and sandbox cybersecurity simulation matrices.',
            telemetryFields: [
              { label: 'Workstations', value: '40 Dual-Screen Terminals' },
              { label: 'Bandwidth', value: '10 Gbps Symmetrical Fiber' },
              { label: 'Current Class', value: 'Algorithms & Full-Stack Systems' },
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
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Desk rows */}
        {[-1.0, 1.0].map((dx, dIdx) => (
          <mesh key={`comp-desk-${dIdx}`} position={[dx, 0.45, 0]} castShadow>
            <boxGeometry args={[1.2, 0.9, 3.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
        {/* Ultra-wide Monitors glowing cyan */}
        {[-1.0, 1.0].map((mx, mIdx) => (
          <mesh key={`comp-mon-${mIdx}`} position={[mx, 1.05, 0]}>
            <boxGeometry args={[0.08, 0.35, 2.4]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
          </mesh>
        ))}
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-sky-950/90 border border-sky-400 px-2 py-0.5 rounded text-[8px] font-mono text-sky-200 font-bold">
            COMPUTER LAB
          </div>
        </Html>
      </group>

      {/* --- D. SCIENCE LABORATORY --- */}
      <group
        position={[16, 1.2, -2.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-science-lab',
            name: 'Bio-Molecular & Applied Chemistry Laboratory',
            category: 'Natural Sciences',
            status: 'optimal',
            efficiency: 98.5,
            powerKw: 4.8,
            description:
              'Cleanroom-grade wet laboratory fitted with digital microscopes, laminar flow fume hoods, microfluidic analysis chips, and automated safety eyewash stations.',
            telemetryFields: [
              { label: 'Safety Index', value: '100% Negative Pressure' },
              { label: 'Active Experiments', value: 'Algae Biofuel Cultivation' },
              { label: 'Spectrometers', value: '4 UV-Vis Digital Units' },
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
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Lab Island Bench */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.8, 0.9, 1.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Chemical Flasks */}
        {[-0.6, 0, 0.6].map((fx, fIdx) => (
          <mesh key={`flask-${fIdx}`} position={[fx, 1.05, 0]}>
            <cylinderGeometry args={[0.06, 0.12, 0.25, 8]} />
            <meshStandardMaterial
              color={fIdx === 0 ? '#10b981' : fIdx === 1 ? '#06b6d4' : '#ec4899'}
              emissive={fIdx === 0 ? '#10b981' : fIdx === 1 ? '#06b6d4' : '#ec4899'}
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-emerald-950/90 border border-emerald-400 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-200 font-bold">
            SCIENCE LAB
          </div>
        </Html>
      </group>

      {/* --- E. DIGITAL MEDIA LIBRARY --- */}
      <group
        position={[16, 1.2, 2.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-digital-library',
            name: 'Digital Knowledge Repository & Media Library',
            category: 'Humanities & Information Science',
            status: 'optimal',
            efficiency: 99.8,
            powerKw: 2.2,
            description:
              'Quiet collaborative cyber-library housing over 500,000 digital volumes, acoustic study pods, holographic archives, and RFID-automated book checkout turnstiles.',
            telemetryFields: [
              { label: 'Digital Archives', value: '520,000 eBooks & Papers' },
              { label: 'Acoustic Pods', value: '16 Individual Study Units' },
              { label: 'Current Readers', value: '62 Students' },
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
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Book Stacks with glowing spine LEDs */}
        {[-1.2, 0, 1.2].map((bx, bIdx) => (
          <mesh key={`book-stack-${bIdx}`} position={[bx, 1.1, 0]} castShadow>
            <boxGeometry args={[0.6, 2.2, 2.8]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
        ))}
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-amber-950/90 border border-amber-400 px-2 py-0.5 rounded text-[8px] font-mono text-amber-200 font-bold">
            LIBRARY
          </div>
        </Html>
      </group>

      {/* --- F. AI RECEPTION & WELCOME CONCIERGE --- */}
      <group
        position={[0, 0.2, 4.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-ai-reception',
            name: 'AI Reception & Biometric Concierge Portal',
            category: 'Campus Administration & Security',
            status: 'optimal',
            efficiency: 100,
            powerKw: 0.8,
            description:
              'Central welcoming concourse with contactless facial biometric visitor check-in, real-time campus interactive kiosk, and automated security badge encoding.',
            telemetryFields: [
              { label: 'Daily Visitors Logged', value: '142 Checked-In' },
              { label: 'Wait Time Average', value: '1.2 Seconds' },
              { label: 'Security Verification', value: '100% Instant Pass' },
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
        {/* Reception Counter Curved Desk */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[1.8, 1.8, 1.1, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
        {/* Hologram Concierge Avatar Display */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Html position={[0, 2.0, 0]} center distanceFactor={7} className="pointer-events-none select-none">
          <div className="bg-sky-950/90 border border-sky-400 px-2 py-0.5 rounded text-[8px] font-mono text-sky-200 font-bold">
            AI RECEPTION
          </div>
        </Html>
      </group>

      {/* --- G. MEDICAL ROOM (SMART HEALTH CLINIC) --- */}
      <group
        position={[11, 4.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-medical-room',
            name: 'Smart Telehealth Clinic & Emergency Medical Room',
            category: 'Student Health & Wellness',
            status: 'optimal',
            efficiency: 100,
            powerKw: 1.4,
            description:
              'Full-service smart healthcare station with contactless vitals diagnostic scanners, automated first-aid robotic medication dispenser, and direct hospital telehealth link.',
            telemetryFields: [
              { label: 'Nurse On Duty', value: 'Nurse Priya & AI Triage-Bot' },
              { label: 'Diagnostic Bed', value: 'Vitals Normal (HR: 72, SpO2: 99%)' },
              { label: 'Emergency Stock', value: '100% Full (Automated Restock)' },
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
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Clinic Bed */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.7, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* Vital Sign Monitor */}
        <mesh ref={vitalPulseRef} position={[0.9, 1.1, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.4]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </mesh>
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-emerald-950/90 border border-emerald-400 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-200 font-bold">
            MEDICAL ROOM
          </div>
        </Html>
      </group>

      {/* --- H. INDOOR GAMING & VR AREA --- */}
      <group
        position={[0, 4.5, -3.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'facility-indoor-gaming',
            name: 'Esports Simulation & Indoor XR Gaming Lounge',
            category: 'Recreation & XR Gaming',
            status: 'active',
            efficiency: 99.3,
            powerKw: 3.8,
            description:
              'State-of-the-art interactive gaming space featuring VR motion rigs, kinetic smart table tennis with trajectory projection, and inter-school esports scrimmage stations.',
            telemetryFields: [
              { label: 'Active XR Rigs', value: '6 Full-Immersion Pods' },
              { label: 'Smart Table Tennis', value: 'Live Match Active' },
              { label: 'Cognitive Reflex Index', value: '+14% Reaction Time Improvement' },
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
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[5.2, 0.1, 3.8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Smart Table Tennis Table with Green Turf & White Line */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.8, 0.9, 2.8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[1.8, 0.1, 0.05]} />
          <meshStandardMaterial color="#ffffff" wireframe />
        </mesh>
        <Html position={[0, 2.3, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-indigo-950/90 border border-indigo-400 px-2 py-0.5 rounded text-[8px] font-mono text-indigo-200 font-bold">
            INDOOR GAMING
          </div>
        </Html>
      </group>
    </group>
  );
};
