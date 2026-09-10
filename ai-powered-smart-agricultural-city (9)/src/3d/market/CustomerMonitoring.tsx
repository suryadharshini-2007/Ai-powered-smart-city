import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { User, Activity } from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface CustomerMonitoringProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  isNight?: boolean;
}

export const CustomerMonitoring: React.FC<CustomerMonitoringProps> = ({
  onSelectNode,
}) => {
  const customer1Ref = useRef<THREE.Group>(null);
  const customer2Ref = useRef<THREE.Group>(null);
  const customer3Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Customer 1: Browsing Rice Aisle (walking slowly between -4.5 and -5.5, z between -1 and 2)
    if (customer1Ref.current) {
      const z = Math.sin(t * 0.6) * 1.8;
      customer1Ref.current.position.z = z;
      // Slight walking bob
      customer1Ref.current.position.y = Math.abs(Math.sin(t * 3.5)) * 0.08;
    }

    // Customer 2: Exploring Vegetable Island (walking around z = -1 to 2, x = 4.8)
    if (customer2Ref.current) {
      const z = Math.cos(t * 0.5) * 1.5;
      customer2Ref.current.position.z = z;
      customer2Ref.current.position.y = Math.abs(Math.sin(t * 3.2)) * 0.07;
    }

    // Customer 3: Walking towards Checkout Concourse
    if (customer3Ref.current) {
      const z = 4.0 + Math.sin(t * 0.4) * 1.6;
      customer3Ref.current.position.z = z;
      customer3Ref.current.position.y = Math.abs(Math.sin(t * 3.0)) * 0.06;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* CUSTOMER 1 (Rice Section Shopper) */}
      {/* ========================================================= */}
      <group
        ref={customer1Ref}
        position={[-4.8, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'customer-node-01',
            name: 'Shopper Profile #842 (Aarav M.)',
            category: 'Customer Flow & Behavioral Analytics',
            status: 'optimal',
            efficiency: 98.2,
            powerKw: 0.02,
            description:
              'Organic cereal enthusiast utilizing indoor AI beacon navigation. Current basket contains organic Basmati Rice and pulses.',
            telemetryFields: [
              { label: 'Dwell Time in Aisle', value: '4 mins 20 secs' },
              { label: 'Basket Value', value: '₹340 Estimated' },
              { label: 'Loyalty Tier', value: 'Eco-Civic Citizen Gold' },
              { label: 'Shopping Efficiency', value: 'Optimal (Direct Pathing)' },
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
        {/* Feet & Legs */}
        <mesh position={[-0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.42, 0.55, 0.25]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        {/* IoT Digital Tracking Beacon above customer */}
        <Html position={[0, 2.0, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-sky-950/80 border border-sky-400/60 px-2 py-0.5 rounded-full text-[8px] font-mono text-sky-200 flex items-center gap-1 shadow-sm">
            <User className="w-2.5 h-2.5 text-sky-400" />
            SHOPPER #842
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* CUSTOMER 2 (Fresh Vegetables Shopper) */}
      {/* ========================================================= */}
      <group
        ref={customer2Ref}
        position={[4.8, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'customer-node-02',
            name: 'Shopper Profile #619 (Meera S.)',
            category: 'Customer Flow & Behavioral Analytics',
            status: 'optimal',
            efficiency: 97.4,
            powerKw: 0.02,
            description:
              'Browsing fresh aeroponic greens and hydroponic vine tomatoes. Scanned QR code for soil and mineral traceability.',
            telemetryFields: [
              { label: 'Dwell Time in Aisle', value: '2 mins 55 secs' },
              { label: 'Basket Value', value: '₹175 Estimated' },
              { label: 'Nutritional Focus', value: 'High Antioxidants & Greens' },
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
        <mesh position={[-0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.4, 0.55, 0.24]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        <Html position={[0, 2.0, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-emerald-950/80 border border-emerald-400/60 px-2 py-0.5 rounded-full text-[8px] font-mono text-emerald-200 flex items-center gap-1 shadow-sm">
            <User className="w-2.5 h-2.5 text-emerald-400" />
            SHOPPER #619
          </div>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* CUSTOMER 3 (Approaching Checkout Concourse) */}
      {/* ========================================================= */}
      <group
        ref={customer3Ref}
        position={[-1.2, 0, 4.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode({
            id: 'customer-node-03',
            name: 'Shopper Profile #904 (Karan D.)',
            category: 'Customer Flow & Behavioral Analytics',
            status: 'optimal',
            efficiency: 99.5,
            powerKw: 0.02,
            description:
              'Completed grocery collection in under 6 minutes. Proceeding to automated RFID checkout station.',
            telemetryFields: [
              { label: 'Basket Completion', value: '100% (3 items)' },
              { label: 'Payment Method', value: 'Biometric Palm Tap' },
              { label: 'Visit Duration', value: '5 mins 40 secs' },
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
        <mesh position={[-0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.12, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.42, 0.55, 0.25]} />
          <meshStandardMaterial color="#7c3aed" />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        <Html position={[0, 2.0, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="bg-purple-950/80 border border-purple-400/60 px-2 py-0.5 rounded-full text-[8px] font-mono text-purple-200 flex items-center gap-1 shadow-sm">
            <User className="w-2.5 h-2.5 text-purple-400" />
            SHOPPER #904
          </div>
        </Html>
      </group>
    </group>
  );
};
