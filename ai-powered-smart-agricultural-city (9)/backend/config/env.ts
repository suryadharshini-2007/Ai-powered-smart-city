import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5001),
  backendPort: Number(process.env.BACKEND_PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_agri_city',
  jwtSecret: process.env.JWT_SECRET || 'smart-agri-city-jwt-secret-key-2026',
  appUrl: process.env.APP_URL || 'http://localhost:5001',
};
