import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { CityConfigModel } from '../models/CityConfig';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { username, email, password, cityName, role } = req.body;
      const userIdentifier = username || email;

      // 1. Validate required fields
      if (!userIdentifier || typeof userIdentifier !== 'string' || !userIdentifier.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Username is required to access the smart city grid.',
        });
      }

      if (!password || typeof password !== 'string' || !password.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Password is required to authenticate overseer identity.',
        });
      }

      const cleanUsername = userIdentifier.trim();
      let user = await UserModel.findByUsernameOrEmail(cleanUsername);

      // 2. If user exists, verify password with bcrypt
      if (user) {
        const isMatch = await UserModel.verifyPassword(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials. The password does not match this overseer account.',
          });
        }
      } else {
        // In interactive prototype mode, dynamically create the user with bcrypt encryption
        user = await UserModel.create({
          username: cleanUsername,
          name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
          email: `${cleanUsername}@aeroagri.city`,
          password,
          role: role || 'City Architect',
        });
      }

      // 3. If a target city was chosen, update active city metrics configuration
      if (cityName && typeof cityName === 'string' && cityName.trim()) {
        await CityConfigModel.update({ cityName: cityName.trim() });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: `jwt-smart-city-${Date.now()}`,
        cityName: cityName || 'AeroAgri Neo-Metropolis',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Authentication failed' });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { username, name, email, password, role } = req.body;
      const cleanUsername = (username || email || '').trim();

      if (!cleanUsername) {
        return res.status(400).json({ success: false, error: 'Username is required' });
      }

      if (!password || password.length < 4) {
        return res.status(400).json({ success: false, error: 'Password must be at least 4 characters' });
      }

      const existing = await UserModel.findByUsernameOrEmail(cleanUsername);
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this username already exists' });
      }

      const newUser = await UserModel.create({
        username: cleanUsername,
        name: name || cleanUsername,
        email: email || `${cleanUsername}@aeroagri.city`,
        password,
        role: role || 'City Architect',
      });

      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token: `jwt-smart-city-${Date.now()}`,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Registration failed' });
    }
  },
};
