import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { cityRouter } from './routes/cityRoutes';
import { zoneRouter } from './routes/zoneRoutes';
import { sensorRouter } from './routes/sensorRoutes';
import { errorHandler } from './middleware/errorHandler';
import { connectDatabase } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/city', cityRouter);
app.use('/api/zones', zoneRouter);
app.use('/api/sensors', sensorRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart Agricultural City Backend API', time: new Date().toISOString() });
});

// Central error handler
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart City Backend] Running on http://localhost:${PORT}`);
  });
}

bootstrap();

export default app;
