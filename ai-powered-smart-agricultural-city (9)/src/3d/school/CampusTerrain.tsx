import React from 'react';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface CampusTerrainProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const CampusTerrain: React.FC<CampusTerrainProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  // Tree coordinates around campus
  const treePositions: [number, number, number][] = [
    [-24, 0, -20],
    [-20, 0, -22],
    [-26, 0, -14],
    [-18, 0, -25],
    [-8, 0, -24],
    [-2, 0, -24],
    [12, 0, -24],
    [24, 0, -22],
    [26, 0, -15],
    [26, 0, 5],
    [26, 0, 18],
    [25, 0, 24],
    [-26, 0, 8],
    [-26, 0, 18],
    [-24, 0, 25],
    [-10, 0, 25],
    [6, 0, 25],
  ];

  // Flower garden planters
  const gardenBeds: [number, number, number][] = [
    [-6, 0.15, -4],
    [6, 0.15, -4],
    [-10, 0.15, 6],
    [10, 0.15, 6],
    [0, 0.15, 8],
  ];

  return (
    <group>
      {/* 1. Base Campus Turf / Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'school-green-campus-01',
            name: 'Eco-Smart Green Campus Grounds',
            category: 'Sustainable Infrastructure',
            status: 'optimal',
            efficiency: 99.4,
            description:
              'Biophilic campus design with 45% indigenous vegetative coverage, permeable storm-absorbent pavers, vertical living walls, and an automated micro-sprinkler irrigation network.',
            telemetryFields: [
              { label: 'Green Cover Ratio', value: '46.2%' },
              { label: 'Soil Moisture', value: '38%', unit: 'VWC' },
              { label: 'Tree Count', value: '84 Native Flora' },
              { label: 'Carbon Offset', value: '14.2 Tons/yr' },
            ],
          });
        }}
      >
        <planeGeometry args={[72, 68]} />
        <meshStandardMaterial
          color={isNight ? '#062017' : '#14532d'}
          roughness={0.9}
        />
      </mesh>

      {/* 2. Main Pedestrian Boulevard & Pathways (Permeable Eco-Pavers) */}
      {/* Central North-South Plaza Spine */}
      <mesh position={[0, 0.01, 2]} receiveShadow>
        <boxGeometry args={[4.2, 0.04, 30]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* East-West Walkway to Sports & Parking */}
      <mesh position={[0, 0.015, 8]} receiveShadow>
        <boxGeometry args={[52, 0.03, 3.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.65} />
      </mesh>

      {/* Entrance Path from Front Gate */}
      <mesh position={[0, 0.02, 22]} receiveShadow>
        <boxGeometry args={[6.5, 0.04, 14]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      {/* Pathway to Restroom & Gardens */}
      <mesh position={[-18, 0.015, -4]} receiveShadow>
        <boxGeometry args={[14, 0.03, 2.4]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Pathway to Playground */}
      <mesh position={[-18, 0.015, 14]} receiveShadow>
        <boxGeometry args={[14, 0.03, 2.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* 3. Campus Perimeter Boundary Walls & Security Gate */}
      <mesh position={[0, 1.0, 31]}>
        <boxGeometry args={[68, 2.0, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Entrance Opening cut (Gap in fence) */}
      <group position={[0, 1.8, 30.8]}>
        {/* Arch Gateway */}
        <mesh position={[-4, 0, 0]}>
          <boxGeometry args={[0.6, 3.6, 0.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[4, 0, 0]}>
          <boxGeometry args={[0.6, 3.6, 0.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[8.6, 0.6, 0.8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
        {/* Welcome Sign Banner */}
        <mesh position={[0, 1.8, 0.45]}>
          <planeGeometry args={[7.8, 0.45]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#38bdf8"
            emissiveIntensity={isNight ? 0.8 : 0.2}
          />
        </mesh>
      </group>

      {/* 4. Landscaped Flower Beds with Modern Concrete Curbs */}
      {gardenBeds.map((pos, idx) => (
        <group
          key={`garden-bed-${idx}`}
          position={pos}
          onClick={(e) => {
            e.stopPropagation();
            onSelectNode({
              id: `garden-bed-${idx}`,
              name: 'Smart Botanical Learning Garden',
              category: 'Green Campus',
              status: 'optimal',
              efficiency: 98.6,
              description:
                'Hands-on experimental botanical plot watered with recycled rainwater, equipped with IoT soil NPK nutrient sensors.',
              telemetryFields: [
                { label: 'Plant Species', value: 'Lavender, Ferns, Roses' },
                { label: 'Irrigation Source', value: 'Rainwater Storage Tank' },
                { label: 'Soil Health Index', value: 'Optimal (pH 6.5)' },
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
          {/* Concrete Border */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.4, 0.3, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          {/* Rich Soil */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[4.0, 0.05, 1.8]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
          </mesh>
          {/* Colorful Botanical Clusters */}
          {[-1.3, -0.4, 0.5, 1.3].map((fx, fIdx) => (
            <mesh
              key={`flower-${fIdx}`}
              position={[fx, 0.3, (fIdx % 2 === 0 ? 0.3 : -0.3)]}
            >
              <sphereGeometry args={[0.26, 8, 8]} />
              <meshStandardMaterial
                color={
                  fIdx % 3 === 0
                    ? '#ec4899'
                    : fIdx % 3 === 1
                    ? '#f59e0b'
                    : '#8b5cf6'
                }
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 5. Lush Shaded Trees */}
      {treePositions.map((pos, idx) => (
        <group
          key={`tree-${idx}`}
          position={pos}
          onClick={(e) => {
            e.stopPropagation();
            onSelectNode({
              id: `campus-tree-${idx}`,
              name: 'Native Canopy Shade Tree',
              category: 'Bio-Climatic Campus',
              status: 'optimal',
              efficiency: 99.0,
              description:
                'Mature deciduous shade tree that provides passive cooling to outdoor gathering courtyards and promotes avian biodiversity.',
              telemetryFields: [
                { label: 'Estimated Age', value: '12 Years' },
                { label: 'Canopy Diameter', value: '4.8 m' },
                { label: 'CO2 Absorption', value: '22 kg/year' },
              ],
            });
          }}
        >
          {/* Trunk */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.35, 3.0, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.9} />
          </mesh>
          {/* Foliage Canopy Tier 1 */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <sphereGeometry args={[1.6, 12, 12]} />
            <meshStandardMaterial
              color={isNight ? '#064e3b' : '#15803d'}
              roughness={0.7}
            />
          </mesh>
          {/* Foliage Canopy Tier 2 */}
          <mesh position={[0, 4.3, 0]} castShadow>
            <sphereGeometry args={[1.2, 10, 10]} />
            <meshStandardMaterial
              color={isNight ? '#047857' : '#16a34a'}
              roughness={0.65}
            />
          </mesh>
        </group>
      ))}

      {/* 6. Vertical Living Green Wall Facades (Installed along West/East wings) */}
      <group
        position={[-12.1, 3.5, -6]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'vertical-green-wall-01',
            name: 'Bio-Filter Vertical Living Garden Wall',
            category: 'Passive Bioclimatic Architecture',
            status: 'optimal',
            efficiency: 98.9,
            description:
              'Modular hydroponic facade containing over 1,200 air-purifying ivy, moss, and fern plants. Reduces building thermal heat island absorption by 4.2°C.',
            telemetryFields: [
              { label: 'Plant Density', value: '64 Plants/m²' },
              { label: 'Surface Cooling', value: '-4.2°C' },
              { label: 'Hydroponic Drip Source', value: 'Filtered Greywater' },
              { label: 'Particulate Filtration', value: 'PM2.5 -22%' },
            ],
          });
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 5.0, 8.0]} />
          <meshStandardMaterial
            color="#166534"
            roughness={0.8}
            bumpScale={0.05}
          />
        </mesh>
        {/* Subtle grid framing */}
        <mesh position={[0.18, 0, 0]}>
          <boxGeometry args={[0.05, 5.2, 8.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
