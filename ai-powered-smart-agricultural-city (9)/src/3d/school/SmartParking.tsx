import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { ParkingBayState } from './SchoolTypes';

interface SmartParkingProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const SmartParking: React.FC<SmartParkingProps> = ({
  onSelectNode,
  isNight = false,
}) => {
  const [bays, setBays] = useState<ParkingBayState[]>([
    {
      id: 'bay-1-ev-bus',
      bayNumber: 'BAY 01 (BUS)',
      status: 'EV_CHARGING',
      vehicleType: 'Zero-Emission Electric School Bus (EV-BUS-04)',
      powerKw: 60.0,
    },
    {
      id: 'bay-2-ev-car',
      bayNumber: 'BAY 02 (STAFF)',
      status: 'EV_CHARGING',
      vehicleType: 'Faculty EV Sedan',
      powerKw: 22.0,
    },
    {
      id: 'bay-3-occupied',
      bayNumber: 'BAY 03 (VISITOR)',
      status: 'OCCUPIED',
      vehicleType: 'Hybrid Passenger Car',
    },
    {
      id: 'bay-4-available',
      bayNumber: 'BAY 04 (STUDENT)',
      status: 'AVAILABLE',
    },
    {
      id: 'bay-5-available',
      bayNumber: 'BAY 05 (CARPOOL)',
      status: 'AVAILABLE',
    },
  ]);

  const cycleBayStatus = (index: number) => {
    setBays((prev) => {
      const next = [...prev];
      const curr = next[index].status;
      if (curr === 'AVAILABLE') {
        next[index].status = 'OCCUPIED';
      } else if (curr === 'OCCUPIED') {
        next[index].status = 'EV_CHARGING';
        next[index].powerKw = 22;
      } else {
        next[index].status = 'AVAILABLE';
        next[index].powerKw = undefined;
      }
      return next;
    });
  };

  const handleSelectBay = (bay: ParkingBayState, index: number) => {
    cycleBayStatus(index);
    onSelectNode({
      id: bay.id,
      name: `Smart Parking Bay ${bay.bayNumber}`,
      category: 'Smart Mobility & EV Infrastructure',
      status: bay.status === 'AVAILABLE' ? 'standby' : 'active',
      efficiency: 99.5,
      powerKw: bay.powerKw || 0,
      description:
        'IoT ultrasound occupancy detector paired with automatic license plate recognition (ALPR) and bidirectional V2G fast-charging pedestals.',
      telemetryFields: [
        { label: 'Sensor Status', value: bay.status.replace('_', ' ') },
        { label: 'Vehicle Detected', value: bay.vehicleType || 'None (Bay Clear)' },
        { label: 'Charging Rate', value: bay.powerKw ? `${bay.powerKw} kW DC Fast Charge` : 'Standby 0 kW' },
        { label: 'Reserved Type', value: bay.bayNumber },
      ],
    });
  };

  const handleSelectBus = () => {
    onSelectNode({
      id: 'electric-school-bus-04',
      name: 'Autonomous Electric Smart School Bus (EV-BUS-04)',
      category: 'Green Transportation',
      status: 'active',
      efficiency: 98.9,
      powerKw: 60.0,
      description:
        'Zero-emission 48-passenger electric school bus equipped with geofenced student safety check-in, real-time parent GPS tracking, and V2G energy export capability.',
      telemetryFields: [
        { label: 'Battery Capacity', value: '180 kWh LFP' },
        { label: 'State of Charge', value: '88% (Charging)' },
        { label: 'Estimated Range', value: '240 km' },
        { label: 'Current Charge Rate', value: '60 kW DC Fast' },
        { label: 'Safety Rating', value: '5-Star NCAP Commercial' },
      ],
    });
  };

  return (
    <group position={[-18, 0, 18]}>
      {/* 1. Asphalt Parking Lot Pad */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[16, 0.04, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* White Parking Demarcation Lines */}
      {[-6, -3, 0, 3, 6].map((lx, lIdx) => (
        <mesh key={`line-${lIdx}`} position={[lx, 0.045, 0]}>
          <boxGeometry args={[0.12, 0.01, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* 2. THE ELECTRIC SCHOOL BUS (Parked in Bay 1, position x = -4.5) */}
      <group
        position={[-4.5, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectBus();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Wheels */}
        {[-0.8, 0.8].map((wx, wIdx) =>
          [-2.2, -0.6, 1.8].map((wz, zIdx) => (
            <mesh
              key={`bus-wheel-${wIdx}-${zIdx}`}
              position={[wx, 0.35, wz]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.35, 0.35, 0.22, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          ))
        )}

        {/* Bus Chassis & Yellow Body */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[1.7, 1.9, 6.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>

        {/* Teal Zero-Emission Eco Decal Stripe */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.72, 0.3, 6.22]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.6} />
        </mesh>

        {/* Large Front Windshield */}
        <mesh position={[0, 1.6, 3.12]}>
          <planeGeometry args={[1.5, 1.1]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Side Passenger Windows */}
        {[-0.86, 0.86].map((sx, sIdx) => (
          <mesh key={`bus-window-${sIdx}`} position={[sx, 1.65, 0]}>
            <boxGeometry args={[0.02, 0.7, 5.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} opacity={0.85} transparent />
          </mesh>
        ))}

        {/* Rooftop Solar/Battery Bulge */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[1.4, 0.22, 4.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>

        {/* Charging Cable plugged in */}
        <mesh position={[-0.95, 0.6, -1.8]}>
          <boxGeometry args={[0.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* 3. Electric Car parked in Bay 2 (x = -1.5) */}
      <group position={[-1.5, 0, 0]}>
        {/* Wheels */}
        {[-0.6, 0.6].map((wx, wIdx) =>
          [-1.2, 1.2].map((wz, zIdx) => (
            <mesh
              key={`car-wheel-${wIdx}-${zIdx}`}
              position={[wx, 0.22, wz]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.22, 0.22, 0.14, 12]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))
        )}
        {/* Car Body */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.3, 0.75, 3.4]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 1.25, -0.2]}>
          <boxGeometry args={[1.1, 0.5, 1.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} opacity={0.9} transparent />
        </mesh>
      </group>

      {/* 4. EV Fast Charging Pedestals */}
      {[-4.5, -1.5].map((px, pIdx) => (
        <group key={`charger-${pIdx}`} position={[px, 0.8, -4.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 1.6, 0.35]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Glowing Green Charging LED Screen */}
          <mesh position={[0, 0.4, 0.18]}>
            <planeGeometry args={[0.25, 0.4]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* 5. 5 Overhead IoT Ultrasonic Parking Sensors with Dynamic LEDs */}
      {[-4.5, -1.5, 1.5, 4.5, 6].map((bx, bIdx) => {
        if (bIdx >= bays.length) return null;
        const bay = bays[bIdx];
        const statusColor =
          bay.status === 'AVAILABLE'
            ? '#22c55e'
            : bay.status === 'OCCUPIED'
            ? '#ef4444'
            : '#06b6d4';

        return (
          <group
            key={`sensor-${bIdx}`}
            position={[bx, 2.8, -4.8]}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectBay(bay, bIdx);
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Mounting Arm */}
            <mesh position={[0, 0, 0.4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* Sensor Puck */}
            <mesh position={[0, 0, 0.8]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Status LED Indicator */}
            <mesh position={[0, -0.06, 0.8]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial
                color={statusColor}
                emissive={statusColor}
                emissiveIntensity={isNight ? 3 : 2}
              />
            </mesh>

            {/* Clickable Sensor Badge HUD */}
            <Html position={[0, 0.4, 0.8]} center distanceFactor={7} className="pointer-events-auto select-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectBay(bay, bIdx);
                }}
                className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-wider uppercase border shadow-lg transition-transform hover:scale-105 ${
                  bay.status === 'AVAILABLE'
                    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500'
                    : bay.status === 'OCCUPIED'
                    ? 'bg-rose-950/90 text-rose-400 border-rose-500'
                    : 'bg-cyan-950/90 text-cyan-400 border-cyan-500 animate-pulse'
                }`}
              >
                {bay.status.replace('_', ' ')}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
