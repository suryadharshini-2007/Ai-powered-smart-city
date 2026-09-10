import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { MasterCityPage } from './pages/MasterCityPage';
import { LoginPage } from './pages/LoginPage';
import { ZoneAgriculturePage } from './pages/ZoneAgriculturePage';
import { ZoneTrafficPage } from './pages/ZoneTrafficPage';
import { ZoneSchoolPage } from './pages/ZoneSchoolPage';
import { ZoneMarketPage } from './pages/ZoneMarketPage';
import { ZoneWastePage } from './pages/ZoneWastePage';
import { ZoneInfrastructurePage } from './pages/ZoneInfrastructurePage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Root layout routes */}
              <Route element={<MainLayout />}>
                {/* Default route to Page 1 (Login & City Setup) */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* 1. Login + City Setup */}
                <Route path="/login" element={<LoginPage />} />

                {/* 2. Master Interactive 3D Smart City */}
                <Route path="/city" element={<MasterCityPage />} />

              {/* 3. Full-screen Location-Specific 3D Scenes */}
              <Route path="/zone/agriculture" element={<ZoneAgriculturePage />} />
              <Route path="/zone/traffic" element={<ZoneTrafficPage />} />
              <Route path="/zone/school" element={<ZoneSchoolPage />} />
              <Route path="/zone/market" element={<ZoneMarketPage />} />
              <Route path="/zone/waste" element={<ZoneWastePage />} />
              <Route path="/zone/infrastructure" element={<ZoneInfrastructurePage />} />

              {/* 4. Smart City Information Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
);
}
