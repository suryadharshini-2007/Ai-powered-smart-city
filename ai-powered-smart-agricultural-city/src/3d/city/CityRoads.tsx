import React from 'react';
import * as THREE from 'three';

export const CityRoads: React.FC = () => {
  const roadWidth = 4.8;
  const roadLength = 56;
  const halfRoad = roadWidth / 2;

  // Zebra crossing bar coordinates
  const zebraBarsCount = 8;
  const zebraWidth = 3.8;
  const zebraStep = zebraWidth / zebraBarsCount;

  return (
    <group position={[0, 0.01, 0]}>
      {/* 1. North-South Main Road */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth, roadLength]} />
        <meshStandardMaterial color="#131d2a" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 2. East-West Main Avenue */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[roadWidth, roadLength]} />
        <meshStandardMaterial color="#131d2a" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 3. Central Intersection Square */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth + 0.05, roadWidth + 0.05]} />
        <meshStandardMaterial color="#172333" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* 4. Center Intersection Roundabout / AI Guidance Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>

      {/* 5. Zebra Crossings on the 4 Arms of the Intersection */}
      {/* North Zebra */}
      <group position={[0, 0.022, -3.2]}>
        {Array.from({ length: zebraBarsCount }).map((_, i) => (
          <mesh
            key={`zn-${i}`}
            position={[-zebraWidth / 2 + i * zebraStep + zebraStep / 2, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[zebraStep * 0.55, 1.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* South Zebra */}
      <group position={[0, 0.022, 3.2]}>
        {Array.from({ length: zebraBarsCount }).map((_, i) => (
          <mesh
            key={`zs-${i}`}
            position={[-zebraWidth / 2 + i * zebraStep + zebraStep / 2, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[zebraStep * 0.55, 1.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* East Zebra */}
      <group position={[3.2, 0.022, 0]}>
        {Array.from({ length: zebraBarsCount }).map((_, i) => (
          <mesh
            key={`ze-${i}`}
            position={[0, 0, -zebraWidth / 2 + i * zebraStep + zebraStep / 2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          >
            <planeGeometry args={[zebraStep * 0.55, 1.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* West Zebra */}
      <group position={[-3.2, 0.022, 0]}>
        {Array.from({ length: zebraBarsCount }).map((_, i) => (
          <mesh
            key={`zw-${i}`}
            position={[0, 0, -zebraWidth / 2 + i * zebraStep + zebraStep / 2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          >
            <planeGeometry args={[zebraStep * 0.55, 1.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 6. Pedestrian Safety Gates & Bollards at Corners */}
      {[
        [-halfRoad - 0.25, -halfRoad - 0.25],
        [halfRoad + 0.25, -halfRoad - 0.25],
        [-halfRoad - 0.25, halfRoad + 0.25],
        [halfRoad + 0.25, halfRoad + 0.25],
      ].map(([bx, bz], idx) => (
        <group key={`corner-gate-${idx}`} position={[bx, 0, bz]}>
          {/* Corner Safety Post */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Pulsing Safety LED on top */}
          <mesh position={[0, 0.92, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
          {/* Guide Rail */}
          <mesh position={[bx > 0 ? -0.4 : 0.4, 0.5, 0]}>
            <boxGeometry args={[0.7, 0.06, 0.06]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.5, bz > 0 ? -0.4 : 0.4]}>
            <boxGeometry args={[0.06, 0.06, 0.7]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 7. Center Lane Dividers (Dashed White Lines) */}
      {/* North arm */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`cld-n-${i}`}
          position={[0, 0.02, -5 - i * 2.2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.12, 1.2]} />
          <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
        </mesh>
      ))}
      {/* South arm */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`cld-s-${i}`}
          position={[0, 0.02, 5 + i * 2.2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.12, 1.2]} />
          <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
        </mesh>
      ))}
      {/* East arm */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`cld-e-${i}`}
          position={[5 + i * 2.2, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[0.12, 1.2]} />
          <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
        </mesh>
      ))}
      {/* West arm */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`cld-w-${i}`}
          position={[-5 - i * 2.2, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[0.12, 1.2]} />
          <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
        </mesh>
      ))}

      {/* 8. Smart Induction Wireless Charging Guidance Strip (Cyan line on emergency/bus lane) */}
      <mesh position={[1.4, 0.021, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 22]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[1.4, 0.021, 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 22]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* 9. Emergency Vehicle Route Marking Symbols */}
      {[-12, 12].map((zPos, idx) => (
        <group key={`em-mark-${idx}`} position={[1.4, 0.022, zPos]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 1.8]} />
            <meshStandardMaterial color="#0ea5e9" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.45, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* 10. Sidewalk Curbs along road edges */}
      {/* North-South Curbs */}
      <mesh position={[-halfRoad - 0.15, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.15, roadLength]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[halfRoad + 0.15, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.15, roadLength]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* East-West Curbs */}
      <mesh position={[0, 0.08, -halfRoad - 0.15]} receiveShadow>
        <boxGeometry args={[roadLength, 0.15, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, halfRoad + 0.15]} receiveShadow>
        <boxGeometry args={[roadLength, 0.15, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    </group>
  );
};
