import React from 'react';
import * as THREE from 'three';
import { CropPlant } from './CropPlant';
import { SoilSensor } from './SoilSensor';
import { SmartIrrigation } from './SmartIrrigation';

interface CropFieldProps {
  position?: [number, number, number];
  rows?: number;
  plantsPerRow?: number;
  isIrrigating?: boolean;
  activeScanRow?: number | null;
  diseasedIndexes?: number[];
  soilMoisture?: number;
  selectedSensorId?: string | null;
  onSelectSensor?: (id: string) => void;
  onSelectDisease?: () => void;
  onSelectField?: () => void;
  targetDashboardPos?: [number, number, number];
}

export const CropField: React.FC<CropFieldProps> = ({
  position = [0, 0, 0],
  rows = 7,
  plantsPerRow = 12,
  isIrrigating = false,
  activeScanRow = null,
  diseasedIndexes = [18, 19, 26], // Indices of affected plants
  soilMoisture = 68,
  selectedSensorId = null,
  onSelectSensor,
  onSelectDisease,
  onSelectField,
  targetDashboardPos,
}) => {
  const fieldWidth = 14;
  const fieldDepth = 10;
  const xStart = -fieldWidth / 2;
  const xEnd = fieldWidth / 2;
  const zStart = -fieldDepth / 2;
  const zEnd = fieldDepth / 2;
  const zStep = fieldDepth / (rows - 1);
  const xStep = fieldWidth / (plantsPerRow - 1);

  // Field bounding box for irrigation layout
  const fieldBounds = {
    minX: xStart,
    maxX: xEnd,
    minZ: zStart,
    maxZ: zEnd,
  };

  return (
    <group position={position}>
      {/* 1. Base Soil Furrow Bed */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          if (onSelectField) {
            e.stopPropagation();
            onSelectField();
          }
        }}
      >
        <planeGeometry args={[fieldWidth + 1.6, fieldDepth + 1.6]} />
        <meshStandardMaterial
          color="#3f2717" // Rich fertile loam soil color
          roughness={0.9}
        />
      </mesh>

      {/* 2. Elevated Soil Ridges / Raised Planting Mounds along each row */}
      {Array.from({ length: rows }).map((_, r) => {
        const z = zStart + r * zStep;
        return (
          <mesh
            key={`mound-${r}`}
            position={[0, 0.09, z]}
            rotation={[0, 0, Math.PI / 2]}
            receiveShadow
          >
            <cylinderGeometry
              args={[0.22, 0.35, fieldWidth + 0.8, 12, 1, false, 0, Math.PI]}
            />
            <meshStandardMaterial
              color="#2d1b0d" // Darker moist soil mound
              roughness={0.95}
            />
          </mesh>
        );
      })}

      {/* 3. Field Edging Berms / Wooden Retaining Border */}
      <mesh position={[0, 0.1, zStart - 0.7]}>
        <boxGeometry args={[fieldWidth + 1.8, 0.2, 0.14]} />
        <meshStandardMaterial color="#573824" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, zEnd + 0.7]}>
        <boxGeometry args={[fieldWidth + 1.8, 0.2, 0.14]} />
        <meshStandardMaterial color="#573824" roughness={0.8} />
      </mesh>

      {/* 4. Smart Drip Irrigation Piping & Spraying Emitters */}
      <SmartIrrigation
        fieldBounds={fieldBounds}
        rows={rows}
        isIrrigating={isIrrigating}
        onClick={onSelectField}
      />

      {/* 5. Crop Plants Rows */}
      {Array.from({ length: rows }).map((_, r) => {
        const z = zStart + r * zStep;
        const isRowScanned = activeScanRow === r;

        return Array.from({ length: plantsPerRow }).map((_, c) => {
          const plantIndex = r * plantsPerRow + c;
          const isDiseased = diseasedIndexes.includes(plantIndex);
          const x = xStart + c * xStep;

          return (
            <CropPlant
              key={`plant-${r}-${c}`}
              position={[x, 0.18, z]}
              isDiseased={isDiseased}
              isScanned={isRowScanned || isDiseased}
              scale={0.95 + ((plantIndex * 17) % 10) * 0.015}
              onClick={
                isDiseased && onSelectDisease
                  ? (e) => {
                      e.stopPropagation();
                      onSelectDisease();
                    }
                  : undefined
              }
            />
          );
        });
      })}

      {/* 6. Precision Soil Sensors placed inside crop rows */}
      <SoilSensor
        position={[xStart + 3, 0.18, zStart + zStep * 1.5]}
        sensorId="SOIL-S1"
        moisture={soilMoisture}
        temperature={24.2}
        isSelected={selectedSensorId === 'SOIL-S1'}
        onClick={() => onSelectSensor && onSelectSensor('SOIL-S1')}
        targetDashboardPos={targetDashboardPos}
      />
      <SoilSensor
        position={[xStart + 9.5, 0.18, zStart + zStep * 4.5]}
        sensorId="SOIL-S2"
        moisture={Math.max(30, soilMoisture - 2)}
        temperature={24.8}
        isSelected={selectedSensorId === 'SOIL-S2'}
        onClick={() => onSelectSensor && onSelectSensor('SOIL-S2')}
        targetDashboardPos={targetDashboardPos}
      />
    </group>
  );
};
