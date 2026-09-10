import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CropField } from './CropField';
import { WeatherStation } from './WeatherStation';
import { WaterTank } from './WaterTank';
import { SolarIrrigation } from './SolarIrrigation';
import { AgricultureDrone, DroneTelemetryData } from './AgricultureDrone';
import { FarmerDashboardStation } from './FarmerDashboard';
import { DiseaseDetectionSystem } from './DiseaseDetectionSystem';
import { SmartPole } from './SmartPole';
import { SurroundingEnvironment } from './SurroundingEnvironment';
import {
  AgricultureInfoPanel,
  AgricultureSelectedType,
} from './AgricultureInfoPanel';
import { SimulationState } from '../../types';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';

interface AgricultureSceneProps {
  simulationState: SimulationState;
  onSelectNode?: (node: SelectedNodeDetails | null) => void;
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
}

// Camera Director component that supports both OrbitControls presets and Drone Follow Camera
const CameraDirector: React.FC<{
  cameraPreset?: 'overview' | 'topDown' | 'isometric' | 'closeUp';
  isFollowingDrone: boolean;
  dronePos: THREE.Vector3;
}> = ({ cameraPreset = 'overview', isFollowingDrone, dronePos }) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current || isFollowingDrone) return;

    switch (cameraPreset) {
      case 'overview':
        camera.position.set(22, 18, 22);
        controlsRef.current.target.set(0, 2, 0);
        break;
      case 'topDown':
        camera.position.set(0, 32, 0.1);
        controlsRef.current.target.set(0, 0, 0);
        break;
      case 'isometric':
        camera.position.set(20, 16, 20);
        controlsRef.current.target.set(0, 1, 0);
        break;
      case 'closeUp':
        camera.position.set(3, 4, 6);
        controlsRef.current.target.set(-1, 1, 0);
        break;
    }
    controlsRef.current.update();
  }, [cameraPreset, camera, isFollowingDrone]);

  useFrame((_, delta) => {
    if (isFollowingDrone && controlsRef.current) {
      // Smoothly follow drone from rear-quarter angle
      const targetCamPos = new THREE.Vector3(
        dronePos.x + 3.5,
        dronePos.y + 2.5,
        dronePos.z + 4.5
      );
      camera.position.lerp(targetCamPos, delta * 3);
      controlsRef.current.target.lerp(dronePos, delta * 4);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={3}
      maxDistance={65}
    />
  );
};

export const AgricultureScene: React.FC<AgricultureSceneProps> = ({
  simulationState,
  onSelectNode,
  cameraPreset = 'overview',
}) => {
  // 1. Selection State
  const [selectedType, setSelectedType] = useState<AgricultureSelectedType | null>('drone');
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  // 2. Drone Telemetry & Interactive State
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetryData>({
    id: 'AG-DRONE-01',
    status: 'HOVERING',
    battery: 76,
    altitude: 18,
    speed: 12,
    cropCoverage: 78,
    plantsScanned: 1248,
    healthy: 1186,
    diseased: 62,
    gps: 'CONNECTED (RTK-GPS)',
  });

  const [droneTargetPos, setDroneTargetPos] = useState<[number, number, number]>([-4, 5, 0]);
  const [isFollowingDrone, setIsFollowingDrone] = useState(false);
  const [droneCurrentPos, setDroneCurrentPos] = useState(new THREE.Vector3(-4, 5, 0));
  const [isDroneScanning, setIsDroneScanning] = useState(false);
  const [activeScanRow, setActiveScanRow] = useState<number | null>(null);
  const [scanStep, setScanStep] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<{
    scanned: number;
    healthy: number;
    diseased: number;
    confidence: number;
  } | null>(null);

  // 3. Soil Moisture & Smart Irrigation Simulation State
  const [soilMoisture, setSoilMoisture] = useState<number>(68);
  const [isIrrigating, setIsIrrigating] = useState<boolean>(true);
  const [irrigationStatusMessage, setIrrigationStatusMessage] = useState<string>(
    'Soil moisture in target range (60%–75%). Micro-drippers operating in optimal pulsing mode.'
  );

  // 4. Disease Treatment State
  const [isTreated, setIsTreated] = useState<boolean>(false);

  // 5. Climate Stats
  const temperature = 29;
  const humidity = 72;
  const windSpeed = 8.4;
  const solarRadiation = 840;
  const rainfall = 0.0;

  // 6. Solar Stats
  const solarOutputKw = 4.8;
  const pumpPowerKw = isIrrigating ? 3.2 : 0.4;
  const energyUsedKwh = 18.6;

  // Periodic Battery / Telemetry Drift
  useEffect(() => {
    const interval = setInterval(() => {
      setDroneTelemetry((prev) => {
        if (prev.status === 'CHARGING') {
          return {
            ...prev,
            battery: Math.min(100, prev.battery + 2),
            speed: 0,
            altitude: 0.5,
          };
        }
        return {
          ...prev,
          speed: prev.status === 'ACTIVE' || prev.status === 'SCANNING' ? 14 : 0,
          altitude: prev.status === 'HOVERING' ? 18 : 16,
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Drone Action: SCAN CROPS
  const handleStartCropScan = () => {
    setSelectedType('drone');
    setIsDroneScanning(true);
    setScanResults(null);
    setDroneTelemetry((prev) => ({ ...prev, status: 'SCANNING', speed: 8 }));

    // Move drone over field center
    setDroneTargetPos([-2, 3.8, -2]);

    // Multi-step scan sequence as requested by prompt
    setScanStep('AI CROP SCANNING...');
    setActiveScanRow(1);

    setTimeout(() => {
      setScanStep('ANALYZING PLANTS...');
      setDroneTargetPos([-2, 3.8, 0]);
      setActiveScanRow(3);
    }, 1500);

    setTimeout(() => {
      setScanStep('DETECTING DISEASE...');
      setDroneTargetPos([-2, 3.8, 2]);
      setActiveScanRow(4);
    }, 3000);

    setTimeout(() => {
      setScanStep('GENERATING REPORT...');
      setActiveScanRow(null);
    }, 4500);

    setTimeout(() => {
      setScanStep(null);
      setIsDroneScanning(false);
      setDroneTelemetry((prev) => ({
        ...prev,
        status: 'HOVERING',
        plantsScanned: prev.plantsScanned + 248,
        healthy: prev.healthy + 231,
        diseased: prev.diseased + 17,
      }));
      setScanResults({
        scanned: 248,
        healthy: 231,
        diseased: 17,
        confidence: 94,
      });
    }, 5800);
  };

  // Drone Action: RETURN TO BASE
  const handleReturnToBase = () => {
    setSelectedType('drone');
    setIsDroneScanning(false);
    setScanStep(null);
    setDroneTelemetry((prev) => ({
      ...prev,
      status: 'RETURNING',
      speed: 22,
    }));

    // Move towards charging base pad at Farmer station
    setDroneTargetPos([14.3, 1.0, -4]);

    setTimeout(() => {
      setDroneTelemetry((prev) => ({
        ...prev,
        status: 'CHARGING',
        speed: 0,
        altitude: 0.4,
      }));
      setDroneTargetPos([14.3, 0.4, -4]);
    }, 2000);
  };

  // Smart Irrigation Scenario: SIMULATE DRY SOIL
  const handleSimulateDrySoil = () => {
    setSelectedType('irrigation');
    setIrrigationStatusMessage('Simulating soil desiccation. Moisture level dropping below threshold...');
    setSoilMoisture(60);

    setTimeout(() => {
      setSoilMoisture(54);
    }, 800);

    setTimeout(() => {
      setSoilMoisture(48);
      setIrrigationStatusMessage(
        'LOW SOIL MOISTURE DETECTED (48%). AUTOMATIC IRRIGATION ACTIVATED'
      );
      setIsIrrigating(true);
    }, 1600);

    // After pump activates, moisture replenishes back to optimal
    setTimeout(() => {
      setSoilMoisture(55);
    }, 3000);

    setTimeout(() => {
      setSoilMoisture(63);
    }, 4200);

    setTimeout(() => {
      setSoilMoisture(68);
      setIrrigationStatusMessage('IRRIGATION OPTIMAL. Target moisture (68%) restored.');
    }, 5400);
  };

  // Smart Irrigation Scenario: SIMULATE OVERWATERING
  const handleSimulateOverwatering = () => {
    setSelectedType('irrigation');
    setIrrigationStatusMessage('Simulating excess runoff / precipitation...');
    setSoilMoisture(76);

    setTimeout(() => {
      setSoilMoisture(84);
      setIrrigationStatusMessage(
        'HIGH SOIL MOISTURE DETECTED (84%). IRRIGATION STOPPED TO PREVENT ROOT HYPOXIA.'
      );
      setIsIrrigating(false);
    }, 1200);
  };

  // Reset Irrigation to optimal
  const handleResetIrrigation = () => {
    setSelectedType('irrigation');
    setSoilMoisture(68);
    setIsIrrigating(true);
    setIrrigationStatusMessage(
      'System reset: Soil moisture at 68% optimal target. Micro-drippers nominal.'
    );
  };

  // Disease Spot Treatment
  const handleTreatDisease = () => {
    setIsTreated(true);
    setTimeout(() => {
      setIsTreated(false);
    }, 10000);
  };

  // Sync selection to parent node handler if provided
  const handleSelectObject = (type: AgricultureSelectedType) => {
    setSelectedType(type);
    if (onSelectNode) {
      const titles: Record<AgricultureSelectedType, string> = {
        drone: 'AG-DRONE-01 Multispectral Scout',
        irrigation: 'Smart Drip Irrigation Grid',
        solar: 'Solar-Powered Irrigation Pump',
        disease: 'Pathology Anomaly (Leaf Blight)',
        soilSensor: 'FDR Soil Moisture Sensor',
        weather: 'Micro-Climate Weather Station',
        aiStation: 'AI Field Monitoring Station',
        field: 'Precision Crop Field #01',
      };
      onSelectNode({
        id: type,
        name: titles[type],
        category: 'AgriTech',
        status: 'Optimal',
        efficiency: 96,
        description: `Precision IoT component in ${titles[type]} actively communicating with AI station.`,
        telemetryFields: [
          { label: 'Moisture', value: soilMoisture, unit: '%' },
          { label: 'Solar Output', value: solarOutputKw, unit: 'kW' },
          { label: 'Drone Battery', value: droneTelemetry.battery, unit: '%' },
        ],
      });
    }
  };

  const isNight = simulationState.timeOfDay === 'night';

  return (
    <div className="relative w-full h-full">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [22, 18, 22], fov: 45 }}
        className="w-full h-full"
      >
        {/* Sky, Fog & Lighting */}
        <color
          attach="background"
          args={[isNight ? '#020617' : '#0369a1']}
        />
        <fog
          attach="fog"
          args={[isNight ? '#020617' : '#0ea5e9', 30, 80]}
        />

        {/* Dynamic Sun / Moon Illumination */}
        <ambientLight intensity={isNight ? 0.25 : 0.75} />
        <directionalLight
          position={[25, 35, 20]}
          intensity={isNight ? 0.3 : 1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        {/* Soft ground bounce light */}
        <hemisphereLight
          args={[isNight ? '#0f172a' : '#38bdf8', '#14532d', 0.5]}
        />

        {isNight && <Stars radius={80} depth={40} count={3000} factor={4} />}

        {/* Interactive Camera Controller */}
        <CameraDirector
          cameraPreset={cameraPreset}
          isFollowingDrone={isFollowingDrone}
          dronePos={droneCurrentPos}
        />

        {/* 1. Surrounding Terrain, Trees, Windbreaks, and Pathways */}
        <SurroundingEnvironment />

        {/* 2. Main Precision Crop Field Bed with Crop Rows & Soil Mounds */}
        <CropField
          position={[-2, 0, 0]}
          rows={7}
          plantsPerRow={12}
          isIrrigating={isIrrigating}
          activeScanRow={activeScanRow}
          soilMoisture={soilMoisture}
          selectedSensorId={selectedSensorId}
          onSelectSensor={(sensorId) => {
            setSelectedSensorId(sensorId);
            handleSelectObject('soilSensor');
          }}
          onSelectDisease={() => handleSelectObject('disease')}
          onSelectField={() => handleSelectObject('field')}
          targetDashboardPos={[13, 2, -4]}
        />

        {/* 3. Specialized Disease Detection Marker over Sector 3B */}
        <DiseaseDetectionSystem
          position={[-2, 0, 0]}
          isSelected={selectedType === 'disease'}
          isScanning={isDroneScanning}
          onClick={() => handleSelectObject('disease')}
        />

        {/* 4. Solar-Powered Irrigation System (Panels + Controller + Pump) */}
        <SolarIrrigation
          position={[-12, 0, -8]}
          isIrrigating={isIrrigating}
          isSelected={selectedType === 'solar'}
          onClick={() => handleSelectObject('solar')}
          solarOutputKw={solarOutputKw}
          pumpPowerKw={pumpPowerKw}
          energyUsedKwh={energyUsedKwh}
        />

        {/* 5. Elevated Buffer Water Tank Reservoir */}
        <WaterTank
          position={[-12, 0, 8]}
          waterLevelPercent={86}
          isSelected={selectedType === 'irrigation'}
          onClick={() => handleSelectObject('irrigation')}
        />

        {/* 6. Precision Micro-Climate Weather Station */}
        <WeatherStation
          position={[13, 0, 8]}
          isSelected={selectedType === 'weather'}
          onClick={() => handleSelectObject('weather')}
          temperature={temperature}
          humidity={humidity}
          windSpeed={windSpeed}
          solarRadiation={solarRadiation}
          rainfall={rainfall}
        />

        {/* 7. Farmer Monitoring Area & AI Monitoring Station with Drone Landing Pad */}
        <FarmerDashboardStation
          position={[13, 0, -4]}
          isSelected={selectedType === 'aiStation'}
          onClick={() => handleSelectObject('aiStation')}
          isDroneDocked={droneTelemetry.status === 'CHARGING'}
        />

        {/* 8. Functional Autonomous Agro-Drone */}
        <AgricultureDrone
          position={[-4, 5, 0]}
          targetPosition={droneTargetPos}
          isScanning={isDroneScanning}
          isSelected={selectedType === 'drone'}
          telemetry={droneTelemetry}
          onClick={() => handleSelectObject('drone')}
          onPositionUpdate={(pos) => setDroneCurrentPos(pos.clone())}
        />

        {/* 9. Smart IoT Street Lighting Poles along Pathways */}
        <SmartPole position={[9, 0, -10]} isNight={isNight} />
        <SmartPole position={[9, 0, 2]} isNight={isNight} />
        <SmartPole position={[9, 0, 12]} isNight={isNight} />
      </Canvas>

      {/* Floating Interactive Telemetry / Control Panel */}
      <AgricultureInfoPanel
        selectedType={selectedType}
        onClose={() => setSelectedType(null)}
        droneTelemetry={droneTelemetry}
        isFollowingDrone={isFollowingDrone}
        onToggleFollowDrone={() => setIsFollowingDrone((prev) => !prev)}
        onStartCropScan={handleStartCropScan}
        onReturnToBase={handleReturnToBase}
        scanStep={scanStep}
        scanResults={scanResults}
        soilMoisture={soilMoisture}
        isIrrigating={isIrrigating}
        irrigationStatusMessage={irrigationStatusMessage}
        onSimulateDrySoil={handleSimulateDrySoil}
        onSimulateOverwatering={handleSimulateOverwatering}
        onResetIrrigation={handleResetIrrigation}
        solarOutputKw={solarOutputKw}
        pumpPowerKw={pumpPowerKw}
        energyUsedKwh={energyUsedKwh}
        temperature={temperature}
        humidity={humidity}
        windSpeed={windSpeed}
        solarRadiation={solarRadiation}
        rainfall={rainfall}
        isTreated={isTreated}
        onTreatDisease={handleTreatDisease}
      />
    </div>
  );
};
