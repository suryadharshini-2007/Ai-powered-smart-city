import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Scan,
  ShoppingBag,
  RotateCw,
  Fingerprint,
} from 'lucide-react';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { CheckoutStage } from './MarketTypes';
import { SAMPLE_CHECKOUT_CART } from './MarketData';
import { marketSounds } from './MarketSounds';

interface SmartCheckoutStationProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  externalTriggerCheckout?: boolean;
  onCheckoutComplete?: () => void;
  isNight?: boolean;
}

export const SmartCheckoutStation: React.FC<SmartCheckoutStationProps> = ({
  onSelectNode,
  externalTriggerCheckout = false,
  onCheckoutComplete,
  isNight = false,
}) => {
  const [stage, setStage] = useState<CheckoutStage>('IDLE');
  const [scannedIndex, setScannedIndex] = useState<number>(0);
  const [laserY, setLaserY] = useState<number>(0);

  const laserMeshRef = useRef<THREE.Mesh>(null);
  const paymentRingRef = useRef<THREE.Mesh>(null);

  // Trigger from outside (e.g. Robot "START PURCHASE" action)
  useEffect(() => {
    if (externalTriggerCheckout && stage === 'IDLE') {
      startCheckoutSequence();
    }
  }, [externalTriggerCheckout]);

  // Start animated sequence: PRODUCT SCAN → CART TOTAL → DIGITAL PAYMENT → PAYMENT SUCCESSFUL
  const startCheckoutSequence = () => {
    if (stage !== 'IDLE' && stage !== 'PAYMENT_SUCCESSFUL') return;

    // 1. PRODUCT SCAN
    setStage('PRODUCT_SCAN');
    setScannedIndex(0);
    marketSounds.playScanBeep();

    setTimeout(() => {
      setScannedIndex(1);
      marketSounds.playScanBeep();
    }, 1100);

    setTimeout(() => {
      setScannedIndex(2);
      marketSounds.playScanBeep();
    }, 2200);

    // 2. CART TOTAL
    setTimeout(() => {
      setStage('CART_TOTAL');
    }, 3200);

    // 3. DIGITAL PAYMENT
    setTimeout(() => {
      setStage('DIGITAL_PAYMENT');
    }, 4800);

    // 4. PAYMENT SUCCESSFUL
    setTimeout(() => {
      setStage('PAYMENT_SUCCESSFUL');
      marketSounds.playSuccessChime();
      if (onCheckoutComplete) onCheckoutComplete();
    }, 6600);

    // Reset to IDLE after showing receipt
    setTimeout(() => {
      setStage('IDLE');
    }, 11000);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Laser scanning sweep animation during PRODUCT_SCAN
    if (laserMeshRef.current) {
      if (stage === 'PRODUCT_SCAN') {
        const sweep = Math.sin(t * 8) * 0.4;
        laserMeshRef.current.position.y = 1.6 + sweep;
        laserMeshRef.current.visible = true;
      } else {
        laserMeshRef.current.visible = false;
      }
    }

    // Payment ring rotation
    if (paymentRingRef.current) {
      paymentRingRef.current.rotation.z = t * 2;
    }
  });

  const cartTotal = SAMPLE_CHECKOUT_CART.reduce((sum, item) => sum + item.total, 0);

  return (
    <group
      position={[0, 0, 7.2]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode({
          id: 'market-smart-checkout',
          name: 'Autonomous High-Speed RFID Checkout & Biometric Gate',
          category: 'Point of Sale & Payment Mesh',
          status: 'optimal',
          efficiency: 99.9,
          powerKw: 1.8,
          description:
            'Contactless walk-through automated checkout pod with millimeter-wave RFID product basket reading, QR/UPI UPI instant routing, and biometric palm authentication.',
          telemetryFields: [
            { label: 'Current Mode', value: stage },
            { label: 'Basket Scan Time', value: '0.38s Ultra-Fast' },
            { label: 'Supported Rails', value: 'CBDC / UPI 2.0 / Biometric / NFC' },
            { label: 'Audit Security', value: 'Zero Inventory Shrinkage (100% Verified)' },
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
      {/* 1. Main Checkout Counter Table */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.1, 2.2]} />
        <meshStandardMaterial
          color={isNight ? '#0f172a' : '#1e293b'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Conveyor Belt Tray */}
      <mesh position={[-0.8, 1.11, 0]}>
        <boxGeometry args={[2.6, 0.04, 1.6]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Dual Scanner Arch (Laser Frame) */}
      <group position={[-0.8, 1.6, 0]}>
        {/* Left column */}
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[0.15, 1.2, 1.7]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>
        {/* Right column */}
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[0.15, 1.2, 1.7]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>
        {/* Top crossbeam */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.55, 0.15, 1.7]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} />
        </mesh>
        {/* Animated Laser Plane */}
        <mesh ref={laserMeshRef} position={[0, 0, 0]}>
          <planeGeometry args={[2.2, 0.05]} />
          <meshBasicMaterial
            color="#ef4444"
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* Grocery Basket on Scanning Tray with Items */}
      <group position={[-0.8, 1.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.35, 0.9]} />
          <meshStandardMaterial color="#cbd5e1" wireframe />
        </mesh>
        {/* Scanned Items representation */}
        <mesh position={[-0.3, 0.15, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.3, 8]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        <mesh position={[0.2, 0.12, -0.15]}>
          <sphereGeometry args={[0.16, 8, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.1, 0.14, 0.2]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* Digital Payment Terminal Pedestal */}
      <group position={[1.6, 1.15, 0]}>
        {/* Terminal Stand */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.5, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Biometric Tap / NFC Sensor Pad */}
        <mesh position={[0, 0.52, 0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.65, 0.08, 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Animated Holographic Ring on Payment Pad */}
        <mesh ref={paymentRingRef} position={[0, 0.58, 0]} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
          <ringGeometry args={[0.16, 0.22, 16]} />
          <meshBasicMaterial
            color={stage === 'PAYMENT_SUCCESSFUL' ? '#22c55e' : '#38bdf8'}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 3D INTERACTIVE SMART CHECKOUT HUD DISPLAY */}
      {/* ========================================================= */}
      <Html
        position={[0, 2.6, 0]}
        center
        distanceFactor={8}
        className="select-none pointer-events-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-80 bg-slate-950/95 backdrop-blur-xl border border-cyan-500/70 rounded-2xl p-4 shadow-[0_0_35px_rgba(6,182,212,0.5)] text-slate-100 font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                <Scan className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-cyan-300">SMART CHECKOUT STATION #01</span>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                stage === 'PAYMENT_SUCCESSFUL'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : stage === 'IDLE'
                  ? 'bg-slate-900 text-slate-400 border border-slate-700'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500 animate-pulse'
              }`}
            >
              {stage.replace('_', ' ')}
            </span>
          </div>

          {/* Sequence Visual Indicator Pills */}
          <div className="grid grid-cols-4 gap-1 mb-3 text-[8px] text-center uppercase tracking-tight">
            <div
              className={`p-1 rounded ${
                stage === 'PRODUCT_SCAN'
                  ? 'bg-cyan-600 text-white font-bold animate-pulse'
                  : stage !== 'IDLE'
                  ? 'bg-cyan-950/80 text-cyan-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              1. Scan
            </div>
            <div
              className={`p-1 rounded ${
                stage === 'CART_TOTAL'
                  ? 'bg-cyan-600 text-white font-bold animate-pulse'
                  : stage === 'DIGITAL_PAYMENT' || stage === 'PAYMENT_SUCCESSFUL'
                  ? 'bg-cyan-950/80 text-cyan-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              2. Total
            </div>
            <div
              className={`p-1 rounded ${
                stage === 'DIGITAL_PAYMENT'
                  ? 'bg-amber-600 text-white font-bold animate-pulse'
                  : stage === 'PAYMENT_SUCCESSFUL'
                  ? 'bg-cyan-950/80 text-cyan-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              3. Pay
            </div>
            <div
              className={`p-1 rounded ${
                stage === 'PAYMENT_SUCCESSFUL'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              4. Done
            </div>
          </div>

          {/* Dynamic Content based on current stage */}
          {stage === 'IDLE' && (
            <div className="text-center py-2">
              <p className="text-[11px] text-slate-300 mb-3">
                Place items on scanner tray or click below to simulate automated checkout.
              </p>
              <button
                type="button"
                onClick={startCheckoutSequence}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Scan className="w-4 h-4" />
                START CHECKOUT
              </button>
            </div>
          )}

          {stage === 'PRODUCT_SCAN' && (
            <div className="py-2">
              <div className="text-[10px] text-cyan-400 font-semibold mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3 animate-spin text-cyan-400" />
                  READING RFID CART TAGS...
                </span>
                <span>{scannedIndex + 1}/3</span>
              </div>
              <div className="space-y-1">
                {SAMPLE_CHECKOUT_CART.slice(0, scannedIndex + 1).map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-900/90 border border-cyan-900/60 px-2 py-1 rounded-lg text-[10px]"
                  >
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-cyan-300 font-bold">₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 'CART_TOTAL' && (
            <div className="py-1">
              <div className="text-[10px] text-slate-400 uppercase mb-1">Basket Calculation</div>
              <div className="space-y-1 mb-2">
                {SAMPLE_CHECKOUT_CART.map((item) => (
                  <div key={item.id} className="flex justify-between text-[10px] text-slate-300">
                    <span>{item.name}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center text-xs font-bold text-emerald-400">
                <span>TOTAL DUE:</span>
                <span className="text-sm">₹{cartTotal}</span>
              </div>
            </div>
          )}

          {stage === 'DIGITAL_PAYMENT' && (
            <div className="py-2 text-center">
              <div className="flex items-center justify-center gap-3 my-2 text-amber-400">
                <Fingerprint className="w-7 h-7 animate-pulse" />
                <QrCode className="w-7 h-7 animate-pulse" />
                <CreditCard className="w-7 h-7 animate-pulse" />
              </div>
              <div className="text-[11px] font-bold text-amber-300">
                AUTHENTICATING BIOMETRIC / UPI...
              </div>
              <div className="text-[9px] text-slate-400 mt-1">
                Processing ₹{cartTotal} via Smart Agricultural Grid CBDC Rail
              </div>
            </div>
          )}

          {stage === 'PAYMENT_SUCCESSFUL' && (
            <div className="py-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
              <div className="text-xs font-bold text-emerald-300">PAYMENT SUCCESSFUL!</div>
              <div className="text-[10px] text-slate-300 mt-1">
                ₹{cartTotal} Transferred &bull; Digital Receipt Emailed
              </div>
              <div className="text-[8px] text-slate-500 mt-2 font-mono">
                TX: #ETH-MKT-984219 • Thank you for supporting Vedic farmers!
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
