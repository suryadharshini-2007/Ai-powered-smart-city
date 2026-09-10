import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EnergyFlowDiagram } from '../components/dashboard/EnergyFlowDiagram';
import { AgricultureSection } from '../components/dashboard/AgricultureSection';
import { TrafficSection } from '../components/dashboard/TrafficSection';
import { MarketSection } from '../components/dashboard/MarketSection';
import { SchoolSection } from '../components/dashboard/SchoolSection';
import { WasteSection } from '../components/dashboard/WasteSection';
import { InfrastructureSection } from '../components/dashboard/InfrastructureSection';

export const DashboardPage: React.FC = () => {
  const { selectedCity } = useAuth();

  // Dynamic live simulated timestamp
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' UTC';
  });

  // =========================================================================
  // 1. AGRICULTURE TELEMETRY STATE
  // Crop Health: 87%, Soil Moisture: 68%, Temp: 29°C, Humidity: 72%, Irrigation: Active, Disease Risk: Low, Drone: Active
  // =========================================================================
  const [agriData, setAgriData] = useState({
    cropHealthPercent: 87.0,
    soilMoisturePercent: 68.0,
    temperatureC: 29.0,
    humidityPercent: 72.0,
    irrigationStatus: 'Active',
    diseaseRisk: 'Low',
    droneStatus: 'Active',
    plantsScanned: 14820,
    waterConsumptionLiters: 3420,
    agriculturalProductivityPercent: 94.6,
  });

  const [cropHealthHistory, setCropHealthHistory] = useState([
    { time: '00:00', health: 85, baseline: 80 },
    { time: '04:00', health: 86, baseline: 80 },
    { time: '08:00', health: 88, baseline: 80 },
    { time: '12:00', health: 87, baseline: 80 },
    { time: '16:00', health: 89, baseline: 80 },
    { time: '20:00', health: 87, baseline: 80 },
  ]);

  const [climateHistory, setClimateHistory] = useState([
    { time: '00:00', temp: 24, humidity: 80 },
    { time: '04:00', temp: 22, humidity: 84 },
    { time: '08:00', temp: 26, humidity: 76 },
    { time: '12:00', temp: 31, humidity: 66 },
    { time: '16:00', temp: 29, humidity: 72 },
    { time: '20:00', temp: 27, humidity: 75 },
  ]);

  // =========================================================================
  // 2. TRAFFIC TELEMETRY STATE
  // Vehicles Detected: 1,248, Violations Today: 37, Accidents Detected: 2, Drones Active: 6
  // Pedestrian Safety: Active, Safety Gates: Ready, Emergency Response: Ready
  // =========================================================================
  const [trafficData, setTrafficData] = useState({
    vehiclesDetected: 1248,
    violationsToday: 37,
    accidentsDetected: 2,
    dronesActive: 6,
    pedestrianSafety: 'Active',
    safetyGates: 'Ready',
    emergencyResponse: 'Ready',
  });

  const [trafficVolumeHistory, setTrafficVolumeHistory] = useState([
    { hour: '06:00', vehicles: 450, speed: 42 },
    { hour: '09:00', vehicles: 1248, speed: 32 },
    { hour: '12:00', vehicles: 890, speed: 38 },
    { hour: '15:00', vehicles: 960, speed: 36 },
    { hour: '18:00', vehicles: 1320, speed: 28 },
    { hour: '21:00', vehicles: 640, speed: 44 },
  ]);

  const [violationsHistory, setViolationsHistory] = useState([
    { category: 'Speeding', count: 18 },
    { category: 'Lane Drift', count: 11 },
    { category: 'Red Light', count: 5 },
    { category: 'Parking Kerb', count: 3 },
  ]);

  // =========================================================================
  // 3. MARKET TELEMETRY STATE
  // Products Available: 428, Robots Active: 8, Customers Today: 1,245
  // =========================================================================
  const [marketData, setMarketData] = useState({
    productsAvailable: 428,
    robotsActive: 8,
    customersToday: 1245,
    digitalPaymentsPercent: 99.4,
    inventoryStatus: 'Optimal (100% Tracked)',
    marketEnergyUsageKw: 18.4,
  });

  const [productCategories, setProductCategories] = useState([
    { name: 'Rice & Grains', count: 142, color: '#f59e0b' },
    { name: 'Vegetables', count: 168, color: '#10b981' },
    { name: 'Wheat & Cereals', count: 68, color: '#f59e0b' },
    { name: 'Fruits & Berries', count: 50, color: '#f43f5e' },
  ]);

  // =========================================================================
  // 4. SCHOOL TELEMETRY STATE
  // Students: 850, AI Robots: 12, Solar Generation: 42 kW
  // =========================================================================
  const [schoolData, setSchoolData] = useState({
    studentsCount: 850,
    aiRobotsCount: 12,
    solarGenerationKw: 42.0,
    smartClassroomsCount: 24,
    sportsFacilitiesCount: 4,
    greenCampusRating: 'A+ Rated (100% Clean)',
    energyConsumptionKw: 28.5,
  });

  const [campusEnergyHistory, setCampusEnergyHistory] = useState([
    { hour: '08:00', solar: 22, consumption: 18 },
    { hour: '10:00', solar: 36, consumption: 25 },
    { hour: '12:00', solar: 42, consumption: 28.5 },
    { hour: '14:00', solar: 38, consumption: 27 },
    { hour: '16:00', solar: 24, consumption: 22 },
    { hour: '18:00', solar: 10, consumption: 15 },
  ]);

  // =========================================================================
  // 5. WASTE TELEMETRY STATE
  // Waste Collected, Smart Bins, Average Fill Level, Recycling Rate, Organic, Plastic, Robots
  // =========================================================================
  const [wasteData, setWasteData] = useState({
    wasteCollectedKg: 4280,
    smartBinsCount: 28,
    averageFillLevelPercent: 64.0,
    recyclingRatePercent: 94.2,
    organicWastePercent: 58.0,
    plasticWastePercent: 24.0,
    collectionRobotsCount: 4,
  });

  const [segregationData, setSegregationData] = useState([
    { name: 'Organic Waste', value: 58, color: '#10b981' },
    { name: 'Recyclable Plastic', value: 24, color: '#38bdf8' },
    { name: 'Paper & Cardboard', value: 12, color: '#f59e0b' },
    { name: 'Other / E-Waste', value: 6, color: '#a855f7' },
  ]);

  // =========================================================================
  // 6. INFRASTRUCTURE TELEMETRY STATE
  // Smart Streetlights, Renewable Energy, Smart Roads, Water Management, Comms, Safety, Energy
  // =========================================================================
  const [infraData, setInfraData] = useState({
    smartStreetlightsCount: 142,
    streetlightsEnergySavedPercent: 78.5,
    renewableEnergyPercent: 100,
    smartRoadsKm: 18.5,
    waterReservesLiters: 145000,
    waterRecycledPercent: 96.8,
    communicationStatus: '5G C-V2X Low Latency',
    publicSafetyIndex: 'Optimal (Zero Uncontained Alerts)',
    gridFrequencyHz: 50.00,
  });

  // =========================================================================
  // 7. ENERGY TELEMETRY STATE
  // Solar: 84 kW, Footstep: 11.8 kJ, City Consumption: 61 kW, Battery Level, Grid Usage
  // =========================================================================
  const [energyData, setEnergyData] = useState({
    solarGenerationKw: 84.0,
    footstepEnergyKj: 11.8,
    cityConsumptionKw: 61.0,
    batteryLevelPercent: 92.0,
    gridUsageKw: -23.0,
  });

  // =========================================================================
  // GRADUAL LIVE SIMULATION LOOP
  // Small realistic fluctuations every 3.5 seconds
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Dynamic timestamp
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' UTC'
      );

      // 2. Agriculture micro-fluctuation
      setAgriData((prev) => {
        const dMoisture = (Math.random() - 0.5) * 0.4;
        const dTemp = (Math.random() - 0.5) * 0.2;
        const dHealth = (Math.random() - 0.5) * 0.2;
        const dHumidity = (Math.random() - 0.5) * 0.3;

        return {
          ...prev,
          soilMoisturePercent: Number(Math.max(62, Math.min(74, prev.soilMoisturePercent + dMoisture)).toFixed(1)),
          temperatureC: Number(Math.max(27, Math.min(31, prev.temperatureC + dTemp)).toFixed(1)),
          cropHealthPercent: Number(Math.max(85, Math.min(90, prev.cropHealthPercent + dHealth)).toFixed(1)),
          humidityPercent: Number(Math.max(68, Math.min(76, prev.humidityPercent + dHumidity)).toFixed(1)),
          plantsScanned: prev.plantsScanned + Math.floor(Math.random() * 3),
        };
      });

      // 3. Traffic micro-fluctuation
      setTrafficData((prev) => {
        const deltaVehicles = Math.floor((Math.random() - 0.45) * 6);
        return {
          ...prev,
          vehiclesDetected: Math.max(1180, Math.min(1350, prev.vehiclesDetected + deltaVehicles)),
        };
      });

      // 4. Energy micro-fluctuation
      setEnergyData((prev) => {
        const dSolar = (Math.random() - 0.5) * 0.8;
        const dFootstep = Math.random() * 0.1;
        const dCity = (Math.random() - 0.5) * 0.5;

        const newSolar = Number((prev.solarGenerationKw + dSolar).toFixed(1));
        const newFootstep = Number((prev.footstepEnergyKj + dFootstep).toFixed(1));
        const newCity = Number((prev.cityConsumptionKw + dCity).toFixed(1));

        return {
          ...prev,
          solarGenerationKw: newSolar,
          footstepEnergyKj: newFootstep,
          cityConsumptionKw: newCity,
          gridUsageKw: Number((newCity - newSolar).toFixed(1)),
        };
      });

      // 5. Market customers increment
      setMarketData((prev) => ({
        ...prev,
        customersToday: prev.customersToday + (Math.random() > 0.4 ? 1 : 0),
      }));

      // 6. Waste fill level micro-shift
      setWasteData((prev) => {
        const dFill = (Math.random() - 0.48) * 0.3;
        return {
          ...prev,
          averageFillLevelPercent: Number(Math.max(55, Math.min(72, prev.averageFillLevelPercent + dFill)).toFixed(1)),
        };
      });

      // 7. Grid frequency micro-regulation
      setInfraData((prev) => {
        const dFreq = (Math.random() - 0.5) * 0.02;
        return {
          ...prev,
          gridFrequencyHz: Number((50.00 + dFreq).toFixed(2)),
        };
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================================================================= */}
        {/* 1. TOP HEADER & DIRECT 3D NAVIGATION JUMP BAR */}
        {/* ================================================================= */}
        <DashboardHeader
          selectedCity={selectedCity || 'Nagercoil'}
          lastUpdated={lastUpdated}
        />

        {/* ================================================================= */}
        {/* 2. ENERGY & VISUAL ENERGY FLOW DIAGRAM */}
        {/* SOLAR + FOOTSTEP ENERGY → SMART GRID → CITY */}
        {/* ================================================================= */}
        <EnergyFlowDiagram
          solarGenerationKw={energyData.solarGenerationKw}
          footstepEnergyKj={energyData.footstepEnergyKj}
          cityConsumptionKw={energyData.cityConsumptionKw}
          batteryLevelPercent={energyData.batteryLevelPercent}
          gridUsageKw={energyData.gridUsageKw}
        />

        {/* ================================================================= */}
        {/* 3. AGRICULTURE SECTION */}
        {/* Crop Health 87%, Soil Moisture 68%, Temp 29°C, Humidity 72%, Charts */}
        {/* ================================================================= */}
        <AgricultureSection
          cropHealthPercent={agriData.cropHealthPercent}
          soilMoisturePercent={agriData.soilMoisturePercent}
          temperatureC={agriData.temperatureC}
          humidityPercent={agriData.humidityPercent}
          irrigationStatus={agriData.irrigationStatus}
          diseaseRisk={agriData.diseaseRisk}
          droneStatus={agriData.droneStatus}
          plantsScanned={agriData.plantsScanned}
          waterConsumptionLiters={agriData.waterConsumptionLiters}
          agriculturalProductivityPercent={agriData.agriculturalProductivityPercent}
          cropHealthHistory={cropHealthHistory}
          climateHistory={climateHistory}
        />

        {/* ================================================================= */}
        {/* 4. TRAFFIC SECTION */}
        {/* Vehicles 1,248, Violations 37, Accidents 2, Drones 6, Charts */}
        {/* ================================================================= */}
        <TrafficSection
          vehiclesDetected={trafficData.vehiclesDetected}
          violationsToday={trafficData.violationsToday}
          accidentsDetected={trafficData.accidentsDetected}
          dronesActive={trafficData.dronesActive}
          pedestrianSafety={trafficData.pedestrianSafety}
          safetyGates={trafficData.safetyGates}
          emergencyResponse={trafficData.emergencyResponse}
          trafficVolumeHistory={trafficVolumeHistory}
          violationsHistory={violationsHistory}
        />

        {/* ================================================================= */}
        {/* 5. MARKET SECTION */}
        {/* Products 428, Robots 8, Customers 1,245, Payments, Inventory */}
        {/* ================================================================= */}
        <MarketSection
          productsAvailable={marketData.productsAvailable}
          robotsActive={marketData.robotsActive}
          customersToday={marketData.customersToday}
          digitalPaymentsPercent={marketData.digitalPaymentsPercent}
          inventoryStatus={marketData.inventoryStatus}
          marketEnergyUsageKw={marketData.marketEnergyUsageKw}
          productCategories={productCategories}
        />

        {/* ================================================================= */}
        {/* 6. SCHOOL SECTION */}
        {/* Students 850, AI Robots 12, Solar 42 kW, Classrooms, Sports */}
        {/* ================================================================= */}
        <SchoolSection
          studentsCount={schoolData.studentsCount}
          aiRobotsCount={schoolData.aiRobotsCount}
          solarGenerationKw={schoolData.solarGenerationKw}
          smartClassroomsCount={schoolData.smartClassroomsCount}
          sportsFacilitiesCount={schoolData.sportsFacilitiesCount}
          greenCampusRating={schoolData.greenCampusRating}
          energyConsumptionKw={schoolData.energyConsumptionKw}
          campusEnergyHistory={campusEnergyHistory}
        />

        {/* ================================================================= */}
        {/* 7. WASTE MANAGEMENT SECTION */}
        {/* Waste Collected, Smart Bins, Fill Level, Recycling Rate, Segregation */}
        {/* ================================================================= */}
        <WasteSection
          wasteCollectedKg={wasteData.wasteCollectedKg}
          smartBinsCount={wasteData.smartBinsCount}
          averageFillLevelPercent={wasteData.averageFillLevelPercent}
          recyclingRatePercent={wasteData.recyclingRatePercent}
          organicWastePercent={wasteData.organicWastePercent}
          plasticWastePercent={wasteData.plasticWastePercent}
          collectionRobotsCount={wasteData.collectionRobotsCount}
          segregationData={segregationData}
        />

        {/* ================================================================= */}
        {/* 8. INFRASTRUCTURE SECTION */}
        {/* Streetlights, Renewable Energy, Smart Roads, Water, Comms, Safety */}
        {/* ================================================================= */}
        <InfrastructureSection
          smartStreetlightsCount={infraData.smartStreetlightsCount}
          streetlightsEnergySavedPercent={infraData.streetlightsEnergySavedPercent}
          renewableEnergyPercent={infraData.renewableEnergyPercent}
          smartRoadsKm={infraData.smartRoadsKm}
          waterReservesLiters={infraData.waterReservesLiters}
          waterRecycledPercent={infraData.waterRecycledPercent}
          communicationStatus={infraData.communicationStatus}
          publicSafetyIndex={infraData.publicSafetyIndex}
          gridFrequencyHz={infraData.gridFrequencyHz}
        />
      </div>
    </div>
  );
};
