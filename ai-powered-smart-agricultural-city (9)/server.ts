import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './backend/routes/authRoutes';
import { cityRouter } from './backend/routes/cityRoutes';
import { zoneRouter } from './backend/routes/zoneRoutes';
import { sensorRouter } from './backend/routes/sensorRoutes';
import { errorHandler } from './backend/middleware/errorHandler';
import { connectDatabase } from './backend/config/db';

const PORT = Number(process.env.PORT) || 5002;

// Simulation state in memory
let activeSimulationState = {
  timeOfDay: 'day',
  simulationSpeed: 1,
  weatherCondition: 'clear',
  automatedIrrigationActive: true,
  droneSurveillanceActive: true,
  gridStabilizationActive: true,
};

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Connect database (MongoDB or instant in-memory fallback)
  await connectDatabase();

  // Backend REST API routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AI-Powered Smart Agricultural City API Engine',
      version: '2.6.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/city', cityRouter);
  app.use('/api/zones', zoneRouter);
  app.use('/api/sensors', sensorRouter);

  // Simulation endpoints
  app.get('/api/simulation/state', (req, res) => {
    res.json({ success: true, data: activeSimulationState });
  });

  app.post('/api/simulation/state', (req, res) => {
    activeSimulationState = { ...activeSimulationState, ...req.body };
    res.json({ success: true, data: activeSimulationState });
  });

  // API Error handler
  app.use('/api', errorHandler);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Agricultural City Server] Live on http://localhost:${PORT}`);
  });
}

startServer();
