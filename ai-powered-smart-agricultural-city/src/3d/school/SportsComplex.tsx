import React from 'react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface SportsComplexProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SportsComplex: React.FC<SportsComplexProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  return (
    <group position={[18, 0, 8]}>
      {/* 1. 4-LANE SYNTHETIC ATHLETIC RUNNING TRACK (Encircles the football and multi-sport pitch) */}
      <group
        position={[0, 0.02, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'athletic-running-track',
            name: 'All-Weather 400m Olympic Synthetic Running Track',
            category: 'Sports & Athletic Performance',
            status: 'optimal',
            efficiency: 99.2,
            description:
              'Polyurethane porous shock-absorbing running track with embedded IoT timing transponders and sprint velocity split-timing camera poles.',
            telemetryFields: [
              { label: 'Surface Standard', value: 'IAAF Certified EPDM' },
              { label: 'Lanes', value: '4 Olympic Standard' },
              { label: 'Active Runners', value: '14 Athletes' },
              { label: 'Record 100m Split', value: '10.84s (Student Senior)' },
            ],
          });
        }}
      >
        {/* Terracotta Track Bed */}
        <mesh receiveShadow>
          <boxGeometry args={[26, 0.03, 19]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.8} />
        </mesh>
        {/* Track White Boundary Rings */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25.6, 18.6]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </group>

      {/* 2. FOOTBALL FIELD (Soccer Pitch) */}
      <group
        position={[-3, 0.04, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'campus-football-pitch',
            name: 'Smart Hybrid Turf Football Field',
            category: 'Sports Complex',
            status: 'active',
            efficiency: 98.7,
            description:
              'High-grade shock-padded artificial turf infused with organic coconut infill, underground drainage siphons, and automated ball-tracking telemetry.',
            telemetryFields: [
              { label: 'Field Dimensions', value: '20m x 13m (Junior Pitch)' },
              { label: 'Turf Drainage', value: '180 mm/hr Capacity' },
              { label: 'Current Match', value: 'Inter-House League: Lions vs Cobras' },
              { label: 'Live Score', value: 'Lions 2 - 1 Cobras (64\')' },
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
        {/* Field Green Grass Turf */}
        <mesh receiveShadow>
          <boxGeometry args={[14, 0.02, 10]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>

        {/* Center Circle */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 1.68, 32]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>

        {/* Center Line */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.08, 0.01, 10]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>

        {/* Left Goal Post */}
        <group position={[-7, 0.7, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 1.4, 2.4]} />
            <meshStandardMaterial color="#ffffff" wireframe />
          </mesh>
        </group>

        {/* Right Goal Post */}
        <group position={[7, 0.7, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 1.4, 2.4]} />
            <meshStandardMaterial color="#ffffff" wireframe />
          </mesh>
        </group>
      </group>

      {/* 3. BASKETBALL COURT (Outdoor Acrylic High-Contrast Court) */}
      <group
        position={[7.5, 0.04, -3.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'basketball-court-01',
            name: 'Pro Acrylic High-Grip Basketball Court',
            category: 'Sports Complex',
            status: 'active',
            efficiency: 99.0,
            description:
              'Multi-layer weather-resistant acrylic hardcourt with breakaway safety rims, LED integrated foul-line sensors, and automatic shot-trajectory sensors.',
            telemetryFields: [
              { label: 'Court Size', value: '11m x 7m Half/Full' },
              { label: 'Surface Friction', value: 'BPN 68 (Optimal Anti-Slip)' },
              { label: 'Current Game', value: '3v3 Varsity Practice' },
              { label: 'Live Score', value: '34 - 31 (Quarter 3)' },
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
        {/* Court Surface */}
        <mesh receiveShadow>
          <boxGeometry args={[7.2, 0.02, 6.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>

        {/* Outer Border Keys */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[6.8, 0.01, 5.8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} />
        </mesh>

        {/* Basketball Hoop Post & Backboard (North End) */}
        <group position={[0, 0, -2.9]}>
          {/* Post */}
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3.2, 12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Acrylic Backboard */}
          <mesh position={[0, 2.7, 0.3]}>
            <boxGeometry args={[1.2, 0.8, 0.04]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          {/* Orange Rim */}
          <mesh position={[0, 2.5, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.02, 12, 24]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        </group>
      </group>

      {/* 4. MULTI-SPORT GROUND (Volleyball, Kabaddi, Badminton) */}
      <group
        position={[7.5, 0.04, 3.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'multi-sport-ground-01',
            name: 'Multi-Sport Convertible Arena (Volleyball/Kabaddi/Badminton)',
            category: 'Sports Complex',
            status: 'active',
            efficiency: 99.4,
            description:
              'Rapid-transformation modular court with motorized net tensioners, embedded floor illumination for game line changes, and sand/clay hybrid shock absorption.',
            telemetryFields: [
              { label: 'Active Mode', value: 'Convertible: Volleyball / Kabaddi / Badminton' },
              { label: 'Surface Material', value: 'High-Density Impact Polymer' },
              { label: 'Line Config', value: 'Smart LED Grid Switchable' },
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
        {/* Court Surface */}
        <mesh receiveShadow>
          <boxGeometry args={[7.2, 0.02, 5.8]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.5} />
        </mesh>
        {/* Court Markings */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[6.8, 0.01, 5.4]} />
          <meshStandardMaterial color="#6d28d9" roughness={0.5} />
        </mesh>
        {/* Center Net for Volleyball / Badminton */}
        <group position={[0, 0.7, 0]}>
          {/* Left Pole */}
          <mesh position={[-3.5, 0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Right Pole */}
          <mesh position={[3.5, 0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Net Mesh */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[6.8, 0.8, 0.04]} />
            <meshStandardMaterial color="#ffffff" wireframe />
          </mesh>
        </group>
      </group>

      {/* 5. OUTDOOR PLAYGROUND EQUIPMENT */}
      <group
        position={[-8, 0, 11]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'outdoor-playground-01',
            name: 'Inclusive Kinetic Play & Exploration Zone',
            category: 'Physical Well-Being & Play',
            status: 'optimal',
            efficiency: 100,
            description:
              'Safety-certified kinetic playground featuring energy-harvesting swings, sensory climbing dome, and impact-cushioned rubber mulch surface.',
            telemetryFields: [
              { label: 'Safety Cushioning', value: 'ASTM F1292 Certified Mulch' },
              { label: 'Energy Harvested', value: '1.4 kWh (From Swings & Turnstiles)' },
              { label: 'Children Active', value: '18 Students' },
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
        {/* Playground Soft Rubber Base */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[9, 0.03, 6.5]} />
          <meshStandardMaterial color="#059669" roughness={0.9} />
        </mesh>

        {/* Swings Structure */}
        <group position={[-2.5, 0, 0]}>
          {/* Frame A-Poles */}
          <mesh position={[-1.2, 1.4, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.05, 0.05, 2.8, 8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} />
          </mesh>
          <mesh position={[1.2, 1.4, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.05, 0.05, 2.8, 8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} />
          </mesh>
          {/* Top Beam */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[2.8, 0.1, 0.1]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} />
          </mesh>
          {/* 2 Swing Seats */}
          {[-0.6, 0.6].map((sx, sIdx) => (
            <group key={`swing-${sIdx}`} position={[sx, 0.6, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.4, 0.05, 0.2]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>
              {/* Chains */}
              <mesh position={[-0.18, 1.0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 2.0, 4]} />
                <meshStandardMaterial color="#cbd5e1" />
              </mesh>
              <mesh position={[0.18, 1.0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 2.0, 4]} />
                <meshStandardMaterial color="#cbd5e1" />
              </mesh>
            </group>
          ))}
        </group>

        {/* Geodesic Climbing Dome */}
        <group position={[2.4, 0, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <icosahedronGeometry args={[1.3, 1]} />
            <meshStandardMaterial color="#ec4899" wireframe />
          </mesh>
        </group>
      </group>
    </group>
  );
};
