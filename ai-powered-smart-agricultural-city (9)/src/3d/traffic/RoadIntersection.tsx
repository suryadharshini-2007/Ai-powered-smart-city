import React from 'react';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface RoadIntersectionProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const RoadIntersection: React.FC<RoadIntersectionProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  // Zebra crossing stripes helper
  const renderZebraCrossings = (
    centerX: number,
    centerZ: number,
    isVertical: boolean
  ) => {
    const stripes = [];
    const count = 9;
    const stripeWidth = 0.7;
    const stripeLength = 4.2;
    const spacing = 1.3;

    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * spacing;
      const x = isVertical ? centerX + offset : centerX;
      const z = isVertical ? centerZ : centerZ + offset;
      const w = isVertical ? stripeWidth : stripeLength;
      const h = isVertical ? stripeLength : stripeWidth;

      stripes.push(
        <mesh
          key={`zebra-${centerX}-${centerZ}-${i}`}
          position={[x, 0.04, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      );
    }
    return stripes;
  };

  // Road arrows helper
  const renderLaneArrows = () => (
    <>
      {/* South approach arrows */}
      <group position={[-3.5, 0.04, 18]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      <group position={[3.5, 0.04, 18]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      {/* North approach arrows */}
      <group position={[-3.5, 0.04, -18]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <mesh>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      <group position={[3.5, 0.04, -18]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <mesh>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      {/* East approach arrows */}
      <group position={[18, 0.04, -3.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <mesh>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      {/* West approach arrows */}
      <group position={[-18, 0.04, 3.5]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <mesh>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
    </>
  );

  return (
    <group>
      {/* Base Terrain / Foundation Ground */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color={isNight ? '#090d16' : '#111827'} roughness={0.9} />
      </mesh>

      {/* Main Asphalt Roads */}
      {/* North-South Road (width: 14m, length: 90m) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 90]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* East-West Road (width: 14m, length: 90m) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Center Junction Asphalt Plate */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14.1, 14.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Yellow Center Median Lines & Dividers */}
      {/* North Median (z from -45 to -9.5) */}
      <mesh position={[0, 0.035, -27.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 35.5]} />
        <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={isNight ? 0.3 : 0.05} />
      </mesh>
      {/* South Median (z from 9.5 to 45) */}
      <mesh position={[0, 0.035, 27.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 35.5]} />
        <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={isNight ? 0.3 : 0.05} />
      </mesh>
      {/* West Median (x from -45 to -9.5) */}
      <mesh position={[-27.25, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35.5, 0.25]} />
        <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={isNight ? 0.3 : 0.05} />
      </mesh>
      {/* East Median (x from 9.5 to 45) */}
      <mesh position={[27.25, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35.5, 0.25]} />
        <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={isNight ? 0.3 : 0.05} />
      </mesh>

      {/* White Dashed Lane Dividers (2 lanes per direction) */}
      {[-3.5, 3.5].map((x) => (
        <React.Fragment key={`ns-lane-${x}`}>
          {/* North dashed lane */}
          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh
              key={`ns-n-${x}-${idx}`}
              position={[x, 0.035, -12 - idx * 3.6]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.18, 1.8]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          ))}
          {/* South dashed lane */}
          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh
              key={`ns-s-${x}-${idx}`}
              position={[x, 0.035, 12 + idx * 3.6]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.18, 1.8]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          ))}
        </React.Fragment>
      ))}

      {[-3.5, 3.5].map((z) => (
        <React.Fragment key={`ew-lane-${z}`}>
          {/* West dashed lane */}
          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh
              key={`ew-w-${z}-${idx}`}
              position={[-12 - idx * 3.6, 0.035, z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[1.8, 0.18]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          ))}
          {/* East dashed lane */}
          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh
              key={`ew-e-${z}-${idx}`}
              position={[12 + idx * 3.6, 0.035, z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[1.8, 0.18]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          ))}
        </React.Fragment>
      ))}

      {/* Stop Lines before Pedestrian Crossings */}
      {/* South Stop Line */}
      <mesh position={[0, 0.038, 11.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13.2, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* North Stop Line */}
      <mesh position={[0, 0.038, -11.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13.2, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* East Stop Line */}
      <mesh position={[11.5, 0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 13.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* West Stop Line */}
      <mesh position={[-11.5, 0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 13.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* 4 Zebra Crossings */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'zebra-crossing-smart',
            name: 'Smart Dynamic Zebra Crossing',
            category: 'Pedestrian Safety',
            status: 'optimal',
            efficiency: 98.6,
            description: 'Thermally monitored pedestrian crossing equipped with sub-surface weight transducers, automated barrier locks, and crosswalk pedestrian priority signal beacons.',
            telemetryFields: [
              { label: 'Pedestrian Density', value: 'Moderate' },
              { label: 'Wait Time Avg', value: '14.2', unit: 's' },
              { label: 'Surface Grip Index', value: '0.94', unit: 'mu' },
            ],
          });
        }}
      >
        {renderZebraCrossings(0, 9, true)}
        {renderZebraCrossings(0, -9, true)}
        {renderZebraCrossings(9, 0, false)}
        {renderZebraCrossings(-9, 0, false)}
      </group>

      {/* Lane Arrows */}
      {renderLaneArrows()}

      {/* Sidewalk Corners (North-West, North-East, South-West, South-East) */}
      {[
        { x: -28, z: -28, key: 'nw' },
        { x: 28, z: -28, key: 'ne' },
        { x: -28, z: 28, key: 'sw' },
        { x: 28, z: 28, key: 'se' },
      ].map((corner) => (
        <group key={corner.key} position={[corner.x, 0.12, corner.z]}>
          {/* Concrete Sidewalk Surface */}
          <mesh receiveShadow>
            <boxGeometry args={[42, 0.24, 42]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Granite Curb Trim facing the roads */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[42.2, 0.1, 42.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
          {/* Green Corner Parklet / Bio-swale planting */}
          <mesh position={[corner.x > 0 ? 8 : -8, 0.13, corner.z > 0 ? 8 : -8]}>
            <boxGeometry args={[20, 0.05, 20]} />
            <meshStandardMaterial color="#166534" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Modern Low-Poly Surrounding Skyline Buildings */}
      <group>
        {/* NW Building Block */}
        <mesh position={[-34, 12, -34]} castShadow>
          <boxGeometry args={[18, 24, 18]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* NW Building Accent Light Strips */}
        <mesh position={[-24.9, 12, -34]}>
          <planeGeometry args={[0.4, 22]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={isNight ? 1.5 : 0.8}
          />
        </mesh>

        {/* NE Tower Block */}
        <mesh position={[36, 18, -34]} castShadow>
          <boxGeometry args={[16, 36, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[27.9, 18, -34]}>
          <planeGeometry args={[0.5, 34]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={isNight ? 1.5 : 0.7}
          />
        </mesh>

        {/* SE Hospital / Medical Science Tower */}
        <group
          position={[36, 14, 36]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectNode({
              id: 'city-general-hospital-precinct',
              name: 'City General Hospital Precinct',
              category: 'Healthcare & Emergency Services',
              status: 'optimal',
              efficiency: 99.8,
              description: 'Level 1 Trauma & Emergency Medical Hub directly synced with Traffic Management V2X system. Priority green waves are automatically allocated for ambulances.',
              telemetryFields: [
                { label: 'ICU Trauma Bays', value: '18 Available' },
                { label: 'Ambulance V2X GreenWave', value: 'ACTIVE' },
                { label: 'Dispatch Response Time', value: '2.4', unit: 'min' },
              ],
            });
          }}
        >
          <mesh castShadow>
            <boxGeometry args={[20, 28, 20]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Glowing Medical Cross Sign on Hospital Facade */}
          <group position={[-10.1, 18, -4]}>
            <mesh rotation={[0, -Math.PI / 2, 0]}>
              <boxGeometry args={[3.2, 0.9, 0.1]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
            </mesh>
            <mesh rotation={[0, -Math.PI / 2, 0]}>
              <boxGeometry args={[0.9, 3.2, 0.1]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
            </mesh>
          </group>
        </group>

        {/* SW Commercial Civic Center */}
        <mesh position={[-36, 10, 36]} castShadow>
          <boxGeometry args={[18, 20, 18]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* High-Tech Overhead Road Gantry with Hospital Direction Sign */}
      <group
        position={[0, 0, 24]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'gantry-sign-v2x',
            name: 'V2X Dynamic Overhead Highway Gantry',
            category: 'Smart Road Signage',
            status: 'optimal',
            efficiency: 99.2,
            description: 'Dynamic digital gantry system providing real-time highway lane allocation, variable speed limits, and emergency medical corridor routing.',
            telemetryFields: [
              { label: 'Sign Type', value: 'MicroLED Matrix' },
              { label: 'Hospital Corridor', value: 'EAST ARTERY' },
              { label: 'Dynamic Speed Limit', value: '40 km/h' },
            ],
          });
        }}
      >
        {/* Left Support Truss Column */}
        <mesh position={[-7.5, 3.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 6.4, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Support Truss Column */}
        <mesh position={[7.5, 3.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 6.4, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Horizontal Overhead Beam */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[16, 0.45, 0.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Big Hospital Direction Digital Road Sign Board */}
        <group position={[0, 5.2, 0.1]}>
          {/* Sign Backplate */}
          <mesh>
            <boxGeometry args={[11, 1.8, 0.2]} />
            <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Sign Bezel Edge Trim */}
          <mesh position={[0, 0, 0.11]}>
            <boxGeometry args={[10.9, 1.7, 0.02]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>

          {/* Hospital Red Cross Icon */}
          <group position={[-4.2, 0, 0.13]}>
            <mesh>
              <boxGeometry args={[0.8, 0.25, 0.02]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.25, 0.8, 0.02]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
            </mesh>
          </group>

          {/* Sign Face Display Plates */}
          <mesh position={[0.4, 0.35, 0.13]}>
            <planeGeometry args={[7.2, 0.5]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={isNight ? 1.4 : 0.7}
            />
          </mesh>
          <mesh position={[0.4, -0.35, 0.13]}>
            <planeGeometry args={[7.2, 0.45]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#059669"
              emissiveIntensity={isNight ? 1.2 : 0.6}
            />
          </mesh>

          {/* Directional Arrow Symbol towards Hospital */}
          <mesh position={[4.6, 0, 0.13]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.35, 0.6, 3]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
          </mesh>
        </group>

        {/* Solar Panel Racks on top of Gantry */}
        <group position={[0, 6.7, 0]}>
          <mesh rotation={[Math.PI / 8, 0, 0]}>
            <boxGeometry args={[12, 0.05, 1.2]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* Decorative Street Trees along sidewalks */}
      {[
        { x: -10, z: -14 },
        { x: -14, z: -10 },
        { x: 10, z: -14 },
        { x: 14, z: -10 },
        { x: -10, z: 14 },
        { x: -14, z: 10 },
        { x: 10, z: 14 },
        { x: 14, z: 10 },
      ].map((pos, idx) => (
        <group key={`tree-${idx}`} position={[pos.x, 0, pos.z]}>
          {/* Tree Trunk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 2.4, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Tree Canopy */}
          <mesh position={[0, 2.6, 0]} castShadow>
            <coneGeometry args={[1.1, 2.2, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <coneGeometry args={[0.8, 1.6, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
