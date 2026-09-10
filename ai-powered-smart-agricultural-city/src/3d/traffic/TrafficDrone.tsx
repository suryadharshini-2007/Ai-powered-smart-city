import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { AccidentTelemetry } from './TrafficTypes';

interface TrafficDroneProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  accidentState?: AccidentTelemetry;
  onDronePositionUpdate?: (pos: THREE.Vector3) => void;
  isNight?: boolean;
}

export const TrafficDrone: React.FC<TrafficDroneProps> = ({
  onSelectNode,
  accidentState,
  onDronePositionUpdate,
  isNight = false,
}) => {
  const droneGroupRef = useRef<THREE.Group>(null);
  const rotorRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  const currentPos = useRef(new THREE.Vector3(0, 9, 0));
  const currentRotY = useRef(0);

  // Normal Patrol Waypoints around the 4-way intersection
  const patrolWaypoints = [
    new THREE.Vector3(12, 8.5, 12),
    new THREE.Vector3(-12, 9.0, 12),
    new THREE.Vector3(-12, 8.5, -12),
    new THREE.Vector3(12, 9.2, -12),
  ];
  const [waypointIdx, setWaypointIdx] = useState(0);

  // Advance waypoints during normal patrol
  useEffect(() => {
    if (accidentState?.detected) return;
    const interval = setInterval(() => {
      setWaypointIdx((prev) => (prev + 1) % patrolWaypoints.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [accidentState?.detected]);

  useFrame(({ clock }, delta) => {
    // 1. Rotor spinning animation
    rotorRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.y += delta * 45;
      }
    });

    if (!droneGroupRef.current) return;

    // 2. Determine target position
    let targetPos = patrolWaypoints[waypointIdx];
    if (accidentState?.detected) {
      // Move directly above accident location (Central Junction: 1.5, 5.5, 0.5)
      targetPos = new THREE.Vector3(1.5, 5.5, 0.5);
    }

    // Gentle hover bobbing
    const hoverOffset = Math.sin(clock.getElapsedTime() * 2.5) * 0.2;
    const targetWithBob = new THREE.Vector3(
      targetPos.x,
      targetPos.y + hoverOffset,
      targetPos.z
    );

    // Smooth movement lerp
    const lerpSpeed = accidentState?.detected ? 2.8 : 1.2;
    currentPos.current.lerp(targetWithBob, delta * lerpSpeed);
    droneGroupRef.current.position.copy(currentPos.current);

    // 3. Drone banking & rotation facing motion direction
    const dir = new THREE.Vector3().subVectors(targetPos, currentPos.current);
    if (dir.length() > 0.3) {
      const targetAngle = Math.atan2(dir.x, dir.z);
      currentRotY.current = THREE.MathUtils.lerp(
        currentRotY.current,
        targetAngle,
        delta * 3
      );
      droneGroupRef.current.rotation.y = currentRotY.current;
      // Banking tilt
      droneGroupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
      droneGroupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 1.5) * 0.05;
    } else {
      // Scanning yaw rotation when hovering over accident
      if (accidentState?.detected) {
        droneGroupRef.current.rotation.y += delta * 0.6;
      }
    }

    if (onDronePositionUpdate) {
      onDronePositionUpdate(currentPos.current);
    }
  });

  const isScanningAccident = !!accidentState?.detected;

  const handleSelect = () => {
    onSelectNode({
      id: 'accident-detection-drone-01',
      name: 'Autonomous Traffic Patrol Drone (DRONE-V2X)',
      category: 'Autonomous Aerial Surveillance',
      status: isScanningAccident ? 'warning' : 'optimal',
      efficiency: 98.8,
      powerKw: 0.42,
      description: 'Hexacopter smart patrol craft equipped with 8K thermal imaging, LiDAR volumetric collision analysis, and high-priority V2X direct emergency relay to dispatch ambulances.',
      telemetryFields: [
        { label: 'Flight Mode', value: isScanningAccident ? 'ACCIDENT OVERWATCH' : 'INTERSECTION PATROL' },
        { label: 'Altitude', value: `${currentPos.current.y.toFixed(1)} m` },
        { label: 'Battery Level', value: '82%' },
        { label: 'Optical Scan', value: isScanningAccident ? 'COLLISION MAPPING' : 'FLOW MONITOR' },
        { label: 'Accident Broadcast', value: isScanningAccident ? 'EMERGENCY TRANSMITTING' : 'STANDBY' },
      ],
    });
  };

  return (
    <group
      ref={droneGroupRef}
      position={[0, 9, 0]}
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
      {/* Central Aerodynamic Carbon Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.18, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Top Avionics Dome */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0284c7"
          emissiveIntensity={isNight ? 1.2 : 0.6}
        />
      </mesh>

      {/* 4 Carbon Arms extending diagonally */}
      {[
        { x: 0.65, z: 0.65, angle: Math.PI / 4, idx: 0 },
        { x: -0.65, z: 0.65, angle: (3 * Math.PI) / 4, idx: 1 },
        { x: -0.65, z: -0.65, angle: (5 * Math.PI) / 4, idx: 2 },
        { x: 0.65, z: -0.65, angle: (7 * Math.PI) / 4, idx: 3 },
      ].map((arm) => (
        <group key={`arm-${arm.idx}`}>
          {/* Carbon Arm Tube */}
          <mesh
            position={[arm.x * 0.5, 0, arm.z * 0.5]}
            rotation={[0, -arm.angle, 0]}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>

          {/* Motor Pod */}
          <mesh position={[arm.x, 0.06, arm.z]}>
            <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Navigation LED Beacon */}
          <mesh position={[arm.x, -0.04, arm.z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color={arm.idx % 2 === 0 ? '#22c55e' : '#ef4444'}
              emissive={arm.idx % 2 === 0 ? '#22c55e' : '#ef4444'}
              emissiveIntensity={2}
            />
          </mesh>

          {/* Rotor Propeller Group */}
          <group ref={rotorRefs[arm.idx]} position={[arm.x, 0.15, arm.z]}>
            {/* Spinning Rotor Blades */}
            <mesh>
              <boxGeometry args={[0.65, 0.015, 0.07]} />
              <meshStandardMaterial
                color="#64748b"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.65, 0.015, 0.07]} />
              <meshStandardMaterial
                color="#64748b"
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* 3-Axis Gimbal Sensor / 8K Camera Pod underneath */}
      <group position={[0, -0.16, 0.05]}>
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Camera Lens */}
        <mesh position={[0, -0.06, 0.09]} rotation={[Math.PI / 3, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 0.08, 12]} />
          <meshStandardMaterial
            color={isScanningAccident ? '#ef4444' : '#38bdf8'}
            emissive={isScanningAccident ? '#ef4444' : '#38bdf8'}
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* Volumetric Scanning Cone projected onto the road */}
      <group position={[0, -2.5, 0.2]} rotation={[Math.PI / 8, 0, 0]}>
        <mesh>
          <coneGeometry
            args={[
              isScanningAccident ? 3.5 : 2.2,
              5.5,
              16,
              1,
              true,
            ]}
          />
          <meshStandardMaterial
            color={isScanningAccident ? '#ef4444' : '#38bdf8'}
            transparent
            opacity={isScanningAccident ? (isNight ? 0.35 : 0.22) : (isNight ? 0.18 : 0.1)}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Animated Scanning Grid Ring on Road Surface */}
        <mesh position={[0, -2.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[isScanningAccident ? 2.8 : 1.6, isScanningAccident ? 3.2 : 1.9, 24]} />
          <meshStandardMaterial
            color={isScanningAccident ? '#ef4444' : '#38bdf8'}
            emissive={isScanningAccident ? '#ef4444' : '#38bdf8'}
            emissiveIntensity={2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
};
