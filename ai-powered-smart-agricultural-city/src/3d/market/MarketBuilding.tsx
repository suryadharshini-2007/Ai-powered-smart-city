import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, Video, Users, PackageCheck, Bot } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface MarketBuildingProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const MarketBuilding: React.FC<MarketBuildingProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const cctv1Ref = useRef<THREE.Group>(null);
  const cctv2Ref = useRef<THREE.Group>(null);
  const telemetryTickerRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Security camera 1: 360-degree scanning oscillation
    if (cctv1Ref.current) {
      cctv1Ref.current.rotation.y = Math.sin(t * 0.8) * 0.9;
    }
    // Security camera 2
    if (cctv2Ref.current) {
      cctv2Ref.current.rotation.y = -Math.cos(t * 0.7) * 0.9;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. FLOOR & TILED TERRAZZO SLAB */}
      {/* ========================================================= */}
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'market-floor-grid',
            name: 'Bio-Terrazzo Smart Sensor Floor Grid',
            category: 'Smart Flooring & Weight Sensors',
            status: 'optimal',
            efficiency: 99.8,
            powerKw: 0.4,
            description:
              'Piezo-electric kinetic energy harvesting floor tiles embedded with sub-surface pressure arrays for contactless customer flow mapping and slip detection.',
            telemetryFields: [
              { label: 'Kinetic Generation', value: '1.4 kWh Harvested Today' },
              { label: 'Footfall Calibration', value: '100% Accurate' },
              { label: 'Slip Hazards', value: 'Zero (Surface dry at 22°C)' },
            ],
          });
        }}
      >
        <boxGeometry args={[26, 0.1, 24]} />
        <meshStandardMaterial
          color={isNight ? '#0b1120' : '#1e293b'}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Decorative Floor Aisle Guide Strips (Subtle glowing lines) */}
      {[-5.0, 0, 5.0].map((lineX, lIdx) => (
        <mesh key={`floor-strip-${lIdx}`} position={[lineX, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 22]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* ========================================================= */}
      {/* 2. CEILING TRUSSES & ARCHITECTURAL CANOPY */}
      {/* ========================================================= */}
      {/* 3 Major Structural Steel Trusses */}
      {[-8, 0, 8].map((tz, tIdx) => (
        <group key={`truss-${tIdx}`} position={[0, 5.8, tz]}>
          <mesh castShadow>
            <boxGeometry args={[25, 0.25, 0.35]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Vertical Support Struts */}
          {[-10, 0, 10].map((sx, sIdx) => (
            <mesh key={`strut-${tIdx}-${sIdx}`} position={[sx, -0.6, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Roof Canopy with Solar Glass Skylights */}
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[25.8, 0.15, 23.8]} />
        <meshStandardMaterial
          color={isNight ? '#030712' : '#0f172a'}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Skylight Glass Apertures */}
      {[-4, 4].map((gx, gIdx) => (
        <mesh key={`skylight-${gIdx}`} position={[gx, 6.22, 0]}>
          <boxGeometry args={[2.5, 0.05, 18]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* ========================================================= */}
      {/* 3. PERIMETER WALLS & GLASS FACADE */}
      {/* ========================================================= */}
      {/* North Wall (Backdrop with Organic Farm graphics) */}
      <mesh position={[0, 2.9, -11.9]} receiveShadow>
        <boxGeometry args={[25.8, 5.8, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-12.9, 2.9, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5.8, 23.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* East Wall */}
      <mesh position={[12.9, 2.9, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5.8, 23.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* South Wall Glass Entrance Portal (Transparent Facade) */}
      <mesh position={[0, 2.9, 11.9]}>
        <boxGeometry args={[25.8, 5.8, 0.15]} />
        <meshStandardMaterial
          color="#38bdf8"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Entrance Automatic Portal Arch */}
      <group position={[0, 1.8, 11.8]}>
        <mesh>
          <boxGeometry args={[5.2, 3.6, 0.35]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 3.2, 0.4]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 4. SECURITY CAMERAS (AI DOME CCTV WITH ROTATING SCANNER CONES) */}
      {/* ========================================================= */}
      {/* Camera 1 (North-West corner) */}
      <group
        position={[-10.5, 5.2, -9.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'security-cam-01',
            name: 'AI 4K Multi-Spectral Security Dome #01',
            category: 'Store Security & Loss Prevention',
            status: 'optimal',
            efficiency: 100,
            powerKw: 0.08,
            description:
              '360-degree computer vision sensor tracking customer density heatmaps, safety compliance, and autonomous cart collision avoidance.',
            telemetryFields: [
              { label: 'Resolution', value: '4K Ultra-HD @ 60fps HDR' },
              { label: 'Vision Model', value: 'Edge Neural Vision Core 4.2' },
              { label: 'Coverage Angle', value: '360° Continuous Sweep' },
            ],
          });
        }}
      >
        <mesh>
          <sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} />
        </mesh>
        <group ref={cctv1Ref}>
          {/* Swiveling Eyeball */}
          <mesh position={[0, -0.12, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* Green active scanner cone */}
          <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.8, 1.4, 16, 1, true]} />
            <meshBasicMaterial
              color="#10b981"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      {/* Camera 2 (South-East corner near checkout) */}
      <group
        position={[10.5, 5.2, 7.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'security-cam-02',
            name: 'AI 4K Multi-Spectral Security Dome #02',
            category: 'Store Security & Loss Prevention',
            status: 'optimal',
            efficiency: 100,
            powerKw: 0.08,
            description:
              'Checkout area security dome monitoring contactless RFID transaction confirmation and biometric gate authorization.',
            telemetryFields: [
              { label: 'Coverage Area', value: 'Checkout Pods & Exit Gate' },
              { label: 'Incident Tally', value: '0 False Alarms' },
              { label: 'Audit Trail', value: 'Blockchain Timestamp Verified' },
            ],
          });
        }}
      >
        <mesh>
          <sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} />
        </mesh>
        <group ref={cctv2Ref}>
          <mesh position={[0, -0.12, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.8, 1.4, 16, 1, true]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 5. OVERHEAD TELEMETRY BOARD (CUSTOMER MONITORING REQUIREMENTS) */}
      {/* ========================================================= */}
      <group
        ref={telemetryTickerRef}
        position={[0, 4.8, -4.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'market-telemetry-master',
            name: 'Campus Retail Command & Telemetry Matrix',
            category: 'Civic Market Operations',
            status: 'optimal',
            efficiency: 99.4,
            powerKw: 1.2,
            description:
              'Central telemetry dashboard monitoring live customer footfall, automated product availability, robot fleet health, and contactless checkout metrics.',
            telemetryFields: [
              { label: 'Customers Today', value: '1,245 Verified' },
              { label: 'Products Available', value: '428 Farm-Gate SKUs' },
              { label: 'Robots Active', value: '8 Autonomous Units' },
              { label: 'Avg Customer Dwell', value: '11 mins 40 secs' },
            ],
          });
        }}
      >
        {/* Mounting frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[9.5, 1.5, 0.25]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[9.2, 1.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* 3D Telemetry HUD Display with Required Metrics */}
        <Html position={[0, 0, 0.2]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="w-[430px] bg-slate-950/90 border border-sky-400/80 rounded-xl p-2.5 shadow-2xl font-mono text-slate-100 flex items-center justify-between gap-2">
            {/* Metric 1 */}
            <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
              <div className="p-1 rounded bg-sky-500/20 text-sky-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Customers Today</div>
                <div className="text-sm font-extrabold text-white">1,245</div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <PackageCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Products Available</div>
                <div className="text-sm font-extrabold text-emerald-400">428</div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-purple-500/20 text-purple-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Robots Active</div>
                <div className="text-sm font-extrabold text-purple-300">8</div>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
