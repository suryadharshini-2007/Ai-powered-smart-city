import React from 'react';
import {
  X,
  Plane,
  Droplets,
  Sun,
  AlertTriangle,
  Radio,
  CloudSun,
  Cpu,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Activity,
  Compass,
} from 'lucide-react';
import { DroneTelemetryData } from './AgricultureDrone';

export type AgricultureSelectedType =
  | 'drone'
  | 'irrigation'
  | 'solar'
  | 'disease'
  | 'soilSensor'
  | 'weather'
  | 'aiStation'
  | 'field';

export interface AgriculturePanelProps {
  selectedType: AgricultureSelectedType | null;
  onClose: () => void;
  // Drone state & actions
  droneTelemetry: DroneTelemetryData;
  isFollowingDrone: boolean;
  onToggleFollowDrone: () => void;
  onStartCropScan: () => void;
  onReturnToBase: () => void;
  scanStep: string | null;
  scanResults: {
    scanned: number;
    healthy: number;
    diseased: number;
    confidence: number;
  } | null;
  // Irrigation simulation states & actions
  soilMoisture: number;
  isIrrigating: boolean;
  irrigationStatusMessage: string;
  onSimulateDrySoil: () => void;
  onSimulateOverwatering: () => void;
  onResetIrrigation: () => void;
  // Solar stats
  solarOutputKw: number;
  pumpPowerKw: number;
  energyUsedKwh: number;
  // Weather stats
  temperature: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
  rainfall: number;
  // Disease treatment
  isTreated: boolean;
  onTreatDisease: () => void;
}

export const AgricultureInfoPanel: React.FC<AgriculturePanelProps> = ({
  selectedType,
  onClose,
  droneTelemetry,
  isFollowingDrone,
  onToggleFollowDrone,
  onStartCropScan,
  onReturnToBase,
  scanStep,
  scanResults,
  soilMoisture,
  isIrrigating,
  irrigationStatusMessage,
  onSimulateDrySoil,
  onSimulateOverwatering,
  onResetIrrigation,
  solarOutputKw,
  pumpPowerKw,
  energyUsedKwh,
  temperature,
  humidity,
  windSpeed,
  solarRadiation,
  rainfall,
  isTreated,
  onTreatDisease,
}) => {
  if (!selectedType) return null;

  return (
    <div className="absolute right-4 top-20 bottom-20 w-96 max-w-[calc(100vw-2rem)] z-30 pointer-events-auto flex flex-col bg-slate-950/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden select-none animate-in fade-in slide-in-from-right-6 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          {selectedType === 'drone' && (
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Plane className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'irrigation' && (
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'solar' && (
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'disease' && (
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'soilSensor' && (
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Radio className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'weather' && (
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <CloudSun className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'aiStation' && (
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
          )}
          {selectedType === 'field' && (
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          )}

          <div>
            <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              {selectedType === 'drone' && 'Autonomous Agro-Drone'}
              {selectedType === 'irrigation' && 'Smart Drip Irrigation'}
              {selectedType === 'solar' && 'Solar Irrigation System'}
              {selectedType === 'disease' && 'Plant Disease Detection'}
              {selectedType === 'soilSensor' && 'IoT Soil Moisture Sensor'}
              {selectedType === 'weather' && 'Micro-Climate Weather Station'}
              {selectedType === 'aiStation' && 'AI Field Monitoring Station'}
              {selectedType === 'field' && 'Precision Crop Field Bed'}
            </h2>
            <p className="text-[10px] font-mono text-slate-400">
              Telemetry &bull; Live Interactive Simulation
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans text-slate-200">
        {/* ================= DRONE PANEL ================= */}
        {selectedType === 'drone' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                TECHNOLOGY PROFILE
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Autonomous aerial drone equipped with multispectral 5-band NDVI
                sensors and AI computer vision for real-time crop canopy
                pathology, nitrogen stress evaluation, and growth indices.
              </p>
            </div>

            {/* Live Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">DRONE ID</span>
                <div className="text-sm font-bold text-sky-400">
                  {droneTelemetry.id}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">STATUS</span>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {droneTelemetry.status}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">BATTERY</span>
                <div className="text-sm font-bold text-amber-400">
                  {droneTelemetry.battery}%
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${droneTelemetry.battery}%` }}
                  />
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">ALTITUDE</span>
                <div className="text-sm font-bold text-white">
                  {droneTelemetry.altitude} m
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">FLIGHT SPEED</span>
                <div className="text-sm font-bold text-white">
                  {droneTelemetry.speed} km/h
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">CROP COVERAGE</span>
                <div className="text-sm font-bold text-emerald-400">
                  {droneTelemetry.cropCoverage}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">PLANTS SCANNED</span>
                <div className="text-sm font-bold text-white">
                  {droneTelemetry.plantsScanned.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">GPS NAVIGATION</span>
                <div className="text-sm font-bold text-emerald-400">
                  {droneTelemetry.gps}
                </div>
              </div>
            </div>

            {/* Scanning Sequence HUD Output */}
            {scanStep && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{scanStep}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {/* Scan Results Card */}
            {scanResults && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SCAN MISSION REPORT COMPLETE</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Plants Scanned:</span>
                  <span className="font-bold text-white">
                    {scanResults.scanned}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Healthy:</span>
                  <span className="font-bold text-emerald-400">
                    {scanResults.healthy}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Potential Disease:</span>
                  <span className="font-bold text-red-400">
                    {scanResults.diseased}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>AI Confidence:</span>
                  <span className="font-bold text-sky-400">
                    {scanResults.confidence}%
                  </span>
                </div>
              </div>
            )}

            {/* Interactive Drone Action Controls */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={onToggleFollowDrone}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-medium font-heading flex items-center justify-center gap-2 transition-all ${
                  isFollowingDrone
                    ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-500/30'
                    : 'bg-slate-900/90 text-sky-300 border-sky-600/50 hover:bg-sky-950 hover:border-sky-400'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{isFollowingDrone ? 'UNFOLLOW DRONE' : 'FOLLOW DRONE (FIRST PERSON)'}</span>
              </button>

              <button
                type="button"
                onClick={onStartCropScan}
                disabled={Boolean(scanStep)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium font-heading flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all text-xs"
              >
                <Play className="w-4 h-4" />
                <span>SCAN CROPS (AI MISSION)</span>
              </button>

              <button
                type="button"
                onClick={onReturnToBase}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-600/40 hover:border-amber-400 font-medium font-heading flex items-center justify-center gap-2 transition-all text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETURN TO BASE (CHARGE DOCK)</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SMART IRRIGATION PANEL ================= */}
        {selectedType === 'irrigation' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                TECHNOLOGY PROFILE
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Sub-surface and drip irrigation system modulated by real-time
                soil moisture telemetry and evapotranspiration models. Delivers
                targeted water with 95% water-use efficiency.
              </p>
            </div>

            {/* Current Moisture & Target Range */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">SOIL MOISTURE:</span>
                <span
                  className={`text-lg font-bold ${
                    soilMoisture < 60
                      ? 'text-amber-400'
                      : soilMoisture > 75
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {soilMoisture}%
                </span>
              </div>

              {/* Range Bar */}
              <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                {/* Target optimal zone highlight (60% to 75%) */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-400"
                  style={{ left: '60%', width: '15%' }}
                />
                {/* Current level fill */}
                <div
                  className={`h-full transition-all duration-300 ${
                    soilMoisture < 60
                      ? 'bg-amber-400'
                      : soilMoisture > 75
                      ? 'bg-cyan-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, soilMoisture))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Dry)</span>
                <span className="text-emerald-400 font-bold">Target: 60%–75%</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Irrigation Status Notification Banner */}
            <div
              className={`p-3 rounded-xl border text-[11px] font-mono transition-all ${
                isIrrigating
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isIrrigating ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
                <span>
                  IRRIGATION STATUS:{' '}
                  {isIrrigating ? 'ACTIVE (FLOWING)' : 'OPTIMAL / STANDBY'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                {irrigationStatusMessage}
              </p>
            </div>

            {/* Interactive Simulation Buttons */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-slate-400">
                INTERACTIVE SCENARIO SIMULATIONS:
              </div>

              <button
                type="button"
                onClick={onSimulateDrySoil}
                className="w-full py-2 px-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/50 hover:border-amber-400 text-amber-200 font-medium font-heading flex items-center justify-between transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                  <span>SIMULATE DRY SOIL (48%)</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-900/60 px-2 py-0.5 rounded">
                  Triggers Pump
                </span>
              </button>

              <button
                type="button"
                onClick={onSimulateOverwatering}
                className="w-full py-2 px-3 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-600/50 hover:border-cyan-400 text-cyan-200 font-medium font-heading flex items-center justify-between transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>SIMULATE OVERWATERING (84%)</span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-900/60 px-2 py-0.5 rounded">
                  Stops Flow
                </span>
              </button>

              <button
                type="button"
                onClick={onResetIrrigation}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium flex items-center justify-center gap-2 transition-all text-xs font-heading"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>RESET TO OPTIMAL (68%)</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SOLAR IRRIGATION PANEL ================= */}
        {selectedType === 'solar' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                ENERGY PATHWAY FLOW
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-bold text-center">
                SOLAR PANELS &rarr; CONTROLLER &rarr; WATER PUMP &rarr; IRRIGATION
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">SOLAR OUTPUT</span>
                <div className="text-sm font-bold text-amber-400">
                  {solarOutputKw} kW
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">PANEL EFFICIENCY</span>
                <div className="text-sm font-bold text-emerald-400">22.4%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">PUMP POWER</span>
                <div className="text-sm font-bold text-sky-400">
                  {pumpPowerKw} kW
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">TODAY ENERGY USED</span>
                <div className="text-sm font-bold text-white">
                  {energyUsedKwh} kWh
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] space-y-2">
              <div className="text-slate-400 font-mono text-[10px]">
                GRID STATUS & CARBON OFFSET
              </div>
              <div className="flex justify-between">
                <span>Off-Grid Self Sufficiency:</span>
                <span className="text-emerald-400 font-bold font-mono">100% Zero-Carbon</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Water Yield:</span>
                <span className="text-white font-bold font-mono">48,000 Liters</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= PLANT DISEASE DETECTION PANEL ================= */}
        {selectedType === 'disease' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-mono text-[11px] font-bold">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>AI PATHOLOGY ANOMALY CONFIRMED</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Multispectral reflectance index anomalies in Sector 3B indicate
                early-stage Leaf Blight (Cercospora sp.) with distinctive yellowed
                chlorosis and necrotic leaf margins.
              </p>
            </div>

            {/* Metrics List */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Crop Health Index:</span>
                <span className="text-amber-400 font-bold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diagnosis:</span>
                <span className="text-red-400 font-bold">Possible Leaf Blight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="text-sky-400 font-bold">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Affected Canopy Area:</span>
                <span className="text-amber-400 font-bold">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Action:</span>
                <span className="text-emerald-400 font-bold">Targeted organic biocontrol</span>
              </div>
            </div>

            {/* Treatment Action */}
            <button
              type="button"
              onClick={onTreatDisease}
              className={`w-full py-2.5 px-3 rounded-xl font-heading font-medium flex items-center justify-center gap-2 transition-all text-xs ${
                isTreated
                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg shadow-emerald-500/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {isTreated
                  ? 'TREATMENT APPLIED &bull; RECOVERY ACTIVE'
                  : 'DISPATCH TARGETED BIO-TREATMENT'}
              </span>
            </button>
          </div>
        )}

        {/* ================= SOIL SENSOR PANEL ================= */}
        {selectedType === 'soilSensor' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                HARDWARE SPECIFICATIONS
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Frequency-Domain Reflectometry (FDR) soil impedance probe
                sampling volumetric water content (VWC), electrical
                conductivity (EC), and subsurface temperature at 15cm depth.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Soil Moisture:</span>
                <span className="text-emerald-400 font-bold">{soilMoisture}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Range:</span>
                <span className="text-white font-bold">60%–75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Soil Condition:</span>
                <span className="text-emerald-400 font-bold">
                  {soilMoisture >= 60 && soilMoisture <= 75
                    ? 'Optimal'
                    : soilMoisture < 60
                    ? 'Sub-Optimal (Dry)'
                    : 'Over-Moist'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Soil Temperature:</span>
                <span className="text-white font-bold">24.5 °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telemetry Link:</span>
                <span className="text-sky-400 font-bold">LoRaWAN (Active Pulse)</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= WEATHER STATION PANEL ================= */}
        {selectedType === 'weather' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                MICRO-CLIMATE INSTRUMENTATION
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Automated weather station calculating Penman-Monteith
                evapotranspiration rates to optimize city agricultural zone
                yields.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">TEMPERATURE</span>
                <div className="text-sm font-bold text-amber-400">
                  {temperature}°C
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">HUMIDITY</span>
                <div className="text-sm font-bold text-sky-400">
                  {humidity}% RH
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">RAINFALL</span>
                <div className="text-sm font-bold text-cyan-400">
                  {rainfall} mm/h
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">WIND SPEED</span>
                <div className="text-sm font-bold text-white">
                  {windSpeed} km/h
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex justify-between items-center font-mono text-[11px]">
              <span className="text-slate-400">SOLAR RADIATION:</span>
              <span className="text-amber-400 font-bold">
                {solarRadiation} W/m²
              </span>
            </div>
          </div>
        )}

        {/* ================= AI MONITORING STATION / FARMER DASHBOARD ================= */}
        {selectedType === 'aiStation' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CENTRAL AGRI-IOT INTELLIGENCE ENGINE</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Aggregated autonomous farm status across soil networks, aerial
                drones, solar pumps, and micro-climate stations.
              </p>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Crop Health Index:</span>
                <span className="text-emerald-400 font-bold">87% Optimal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Mean Soil Moisture:</span>
                <span className="text-white font-bold">{soilMoisture}% (Target: 60–75%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Irrigation Mode:</span>
                <span className="text-cyan-400 font-bold">
                  {isIrrigating ? 'Active Pumping' : 'Standby / Optimal'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Drone Fleet:</span>
                <span className="text-sky-400 font-bold">
                  {droneTelemetry.id} ({droneTelemetry.status})
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Solar Power Gen:</span>
                <span className="text-amber-400 font-bold">
                  {solarOutputKw} kW
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= FIELD BED PANEL ================= */}
        {selectedType === 'field' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                FIELD SECTOR #01 PROFILE
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                High-yield bio-fortified agricultural crop furrow bed with
                organic mulch soil bed, subsurface drip lines, and continuous
                moisture monitoring.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Crop Variety:</span>
                <span className="text-white font-bold">Golden Millet & Pulse</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Growth Stage:</span>
                <span className="text-emerald-400 font-bold">Vegetative / Tasseling (Day 48)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mean NDVI Index:</span>
                <span className="text-sky-400 font-bold">0.78 (Healthy Canopy)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Yield:</span>
                <span className="text-amber-400 font-bold">4.2 Tons / Hectare</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
