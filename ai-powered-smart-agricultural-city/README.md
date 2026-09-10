# AI-POWERED SMART AGRICULTURAL CITY

An interactive full-stack 3D smart city web application built with **React**, **Three.js / React Three Fiber**, **Node.js Express REST APIs**, and a **MongoDB-ready architecture**.

This project provides a robust foundation for building, visualizing, and simulating an autonomous urban agricultural metropolis.

---

## 🌟 Four Core Experiences

1. **Login + City Setup (`/login`)**:
   - Overseer authentication with role selection (City Architect, Agronomist, Systems Operator, Guest Overseer).
   - Interactive biosphere calibration: target crop yield, solar capacity, and active automation zones.

2. **Master Interactive 3D Smart City (`/city`)**:
   - Panoramic 3D overview of the entire interconnected smart city.
   - Dynamic circadian lighting (Day, Dusk, Night, Dawn) with starfields.
   - Autonomous survey drones, animated central AI core, and interactive zone landmark pins.
   - Clickable 3D elements with dynamic inspection panels.

3. **Full-screen Location-Specific 3D Scenes (`/zone/*`)**:
   - `/zone/agriculture`: Aeroponic towers, geodesic bioclimatic domes, automated mist irrigation.
   - `/zone/traffic`: Autonomous cold-chain delivery pods, dispatch tower, V2X transit corridors.
   - `/zone/school`: Agri-Tech academy campus, robotics testing labs, genomic seed vault.
   - `/zone/market`: Algorithmic bio-market pavilion, automated crop grading carousel.
   - `/zone/waste`: Thermophilic anaerobic digesters, biochar pyrolysis kilns.
   - `/zone/infrastructure`: Heliostat solar power tower, subterranean purified aquifer storage.

4. **Smart City Information Dashboard (`/dashboard`)**:
   - Real-time Recharts visualizations (Crop yield forecasts, clean energy vs consumption).
   - Live IoT sensor telemetry table with real-time status pills.
   - Quick navigation into any 3D spatial zone.

---

## 🛠 Tech Stack

### Frontend
- **React 19** & **Vite**
- **Three.js**, **@react-three/fiber**, **@react-three/drei**
- **React Router**
- **Recharts** (Interactive telemetry charts)
- **Tailwind CSS** (Futuristic glassmorphism & responsive layouts)
- **Lucide React** (Vector icons)

### Backend
- **Node.js** & **Express**
- **RESTful API endpoints** (`/api/auth`, `/api/city`, `/api/zones`, `/api/sensors`, `/api/simulation`)
- **MongoDB-ready architecture** with automatic resilient in-memory fallback
- **bcryptjs** for secure password hashing
- **cors** & **dotenv**

---

## 📁 Architecture & File Tree

```
smart-agricultural-city/
├── backend/
│   ├── config/             # DB & environment config
│   ├── controllers/        # Express REST controllers
│   ├── data/               # Seed data
│   ├── middleware/         # Auth & error handling
│   ├── models/             # User, CityConfig, ZoneData, SensorReading
│   ├── routes/             # auth, city, zone, and sensor routers
│   ├── package.json        # Backend dependencies
│   └── server.js           # Standalone Express runner (port 5000)
│
├── frontend/ (or root src/)
│   ├── src/
│   │   ├── 3d/             # Independent modular 3D scenes
│   │   │   ├── city/           # CityMasterScene.tsx
│   │   │   ├── agriculture/    # AgricultureScene.tsx
│   │   │   ├── traffic/        # TrafficScene.tsx
│   │   │   ├── school/         # SchoolScene.tsx
│   │   │   ├── market/         # MarketScene.tsx
│   │   │   ├── waste/          # WasteScene.tsx
│   │   │   └── infrastructure/ # InfrastructureScene.tsx
│   │   ├── components/     # Navigation, GlassPanel, StatusBadge, etc.
│   │   ├── data/           # Centralized mock dataset
│   │   ├── hooks/          # useCityData, useSimulation, useZoneTelemetry
│   │   ├── layouts/        # MainLayout, FullscreenSceneLayout
│   │   ├── pages/          # Route page wrappers
│   │   ├── services/       # Unified API client with automatic fallback
│   │   └── utils/          # formatters, calculations
│   ├── package.json
│   └── vite.config.js
│
├── server.ts               # Unified Express + Vite dev runner (port 3000)
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Running in VS Code

### Option 1: Unified Full-Stack Dev Server (Recommended)
This starts both the Express REST APIs and Vite frontend together on **port 3000**:

```bash
# 1. Install root dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start unified dev server
npm run dev
```

Visit: `http://localhost:3000`

---

### Option 2: Split Frontend & Backend

#### Start the Backend:
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000/api`.

#### Start the Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## 🧩 Modularity Rule for 3D Scenes

Every 3D scene is an **independent React component**:
- `AgricultureScene.tsx`
- `TrafficScene.tsx`
- `SchoolScene.tsx`
- `MarketScene.tsx`
- `WasteScene.tsx`
- `InfrastructureScene.tsx`

You can develop, restyle, or import GLTF models into any of these files without altering any other scene.
