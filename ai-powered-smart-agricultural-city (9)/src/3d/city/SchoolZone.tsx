import React from 'react';
import * as THREE from 'three';
import { InteractiveZone } from './InteractiveZone';
import { CityBuilding } from './CityBuilding';
import { theme } from '../theme/visualTheme';

interface SchoolZoneProps {
  position?: [number, number, number];
  onSelect?: () => void;
}

export const SchoolZone: React.FC<SchoolZoneProps> = ({
  position = [14, 0, -14],
  onSelect,
}) => {
  return (
    <InteractiveZone
      id="school"
      name="SMART SCHOOL"
      route="/zone/school"
      position={position}
      color="#a855f7"
      statusText="Attendance: 99.1%"
      healthMetric="Net-Zero Energy"
      subStatus="Air Quality: Pure"
      onSelect={onSelect}
      tooltipOffset={[0, 5.2, 0]}
    >
      {/* Campus Base Plaza */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color={theme.infrastructure.grassFresh} roughness={0.8} />
      </mesh>

      {/* 1. Main Smart Academic Building (Wing A) */}
      <CityBuilding
        position={[-1.8, 0, -2.2]}
        size={[5.5, 3.2, 3.5]}
        color={theme.school.wallWhite}
        roofColor={theme.school.solarPanel}
        windowColor={theme.school.windowBlue}
        hasSolarRoof={true}
        hasAntenna={true}
      />

      {/* 2. Science & Agri-Bot Atrium (Wing B) */}
      <CityBuilding
        position={[2.6, 0, -1.8]}
        size={[3.2, 2.4, 2.8]}
        color={theme.school.fieldGreen}
        roofColor={theme.school.solarPanel}
        windowColor={theme.school.windowBlue}
        hasGreenery={true}
      />

      {/* 3. School Entrance Glass Canopy & Signage */}
      <mesh position={[-0.5, 1.2, 0.2]}>
        <boxGeometry args={[2.5, 0.1, 1.2]} />
        <meshStandardMaterial color={theme.school.wallWhite} transparent opacity={0.8} />
      </mesh>
      {/* Entrance Columns */}
      <mesh position={[-1.5, 0.55, 0.6]}>
        <cylinderGeometry args={[0.08, 0.08, 1.1, 8]} />
        <meshStandardMaterial color={theme.infrastructure.treeLeaves} metalness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.55, 0.6]}>
        <cylinderGeometry args={[0.08, 0.08, 1.1, 8]} />
        <meshStandardMaterial color={theme.infrastructure.treeLeaves} metalness={0.9} />
      </mesh>

      {/* 4. Sports Area / Turf & Running Track */}
      <group position={[0, 0.06, 3.2]}>
        {/* Synthetic Green Turf Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.5, 4.0]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>

        {/* Outer Running Track Oval (Red Polyurethane) */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.6, 32]} />
          <meshStandardMaterial color={theme.school.fieldGreen} roughness={0.8} />
        </mesh>

        {/* Center Soccer / Field Markings */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.68, 16]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 3.6]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>

        {/* Mini Goal Posts */}
        <mesh position={[-3.2, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.7, 1.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[3.2, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.7, 1.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* 5. Playground Elements (Interactive Climber / Smart Swings) */}
      <group position={[-3.8, 0, 1.2]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 0.8, 8]} />
          <meshStandardMaterial color={theme.school.basketballCourt} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.7, 0.5, 8]} />
          <meshStandardMaterial color={theme.school.gardenGreen} />
        </mesh>
      </group>

      {/* 6. Green Campus Trees & Biosphere Garden */}
      {[
        [-4.2, 0, -4.2],
        [4.2, 0, -4.2],
        [4.2, 0, 1.5],
      ].map(([tx, ty, tz], idx) => (
        <group key={`school-tree-${idx}`} position={[tx, ty, tz]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 1.4, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.7, 0]}>
            <sphereGeometry args={[0.65, 8, 8]} />
            <meshStandardMaterial color={theme.school.gardenGreen} />
          </mesh>
        </group>
      ))}

      {/* 7. Pedestrian Walkway into Campus */}
      <mesh position={[-0.5, 0.06, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 2.5]} />
        <meshStandardMaterial color={theme.school.wallWhite} roughness={0.6} />
      </mesh>
    </InteractiveZone>
  );
};
