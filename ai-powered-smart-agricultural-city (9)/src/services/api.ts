import { CityMetrics, ZoneSummary, SensorReading, SimulationState, UserProfile } from '../types';
import { initialCityMetrics, zoneSummaries, sampleSensorReadings, defaultSimulationState } from '../data/centralizedMockData';

const API_BASE_URL = '/api';

/**
 * Universal safe fetcher with instant graceful fallback to centralized mock data.
 * Allows seamless hot-switching between offline/mock mode and live backend database.
 */
async function safeFetch<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<{ data: T; isLive: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[API] Endpoint ${endpoint} returned status ${response.status}. Falling back to mock dataset.`);
      return { data: fallbackData, isLive: false };
    }

    const json = await response.json();
    return { data: (json.data ?? json) as T, isLive: true };
  } catch (error) {
    // Expected when running client-only preview or during server initialization
    return { data: fallbackData, isLive: false };
  }
}

export const apiService = {
  // City Metrics
  async getCityMetrics(): Promise<{ data: CityMetrics; isLive: boolean }> {
    return safeFetch<CityMetrics>('/city/metrics', initialCityMetrics);
  },

  // Zones
  async getZones(): Promise<{ data: ZoneSummary[]; isLive: boolean }> {
    const fallbackList = Object.values(zoneSummaries);
    return safeFetch<ZoneSummary[]>('/zones', fallbackList);
  },

  async getZone(zoneId: string): Promise<{ data: ZoneSummary; isLive: boolean }> {
    const fallback = zoneSummaries[zoneId] || zoneSummaries.agriculture;
    return safeFetch<ZoneSummary>(`/zones/${zoneId}`, fallback);
  },

  // Sensors & Telemetry
  async getSensorReadings(zoneId?: string): Promise<{ data: SensorReading[]; isLive: boolean }> {
    const filtered = zoneId ? sampleSensorReadings.filter(s => s.zoneId === zoneId) : sampleSensorReadings;
    const endpoint = zoneId ? `/sensors?zone=${zoneId}` : '/sensors';
    return safeFetch<SensorReading[]>(endpoint, filtered);
  },

  // Simulation State
  async getSimulationState(): Promise<{ data: SimulationState; isLive: boolean }> {
    return safeFetch<SimulationState>('/simulation/state', defaultSimulationState);
  },

  async updateSimulationState(patch: Partial<SimulationState>): Promise<{ data: SimulationState; isLive: boolean }> {
    return safeFetch<SimulationState>('/simulation/state', { ...defaultSimulationState, ...patch }, {
      method: 'POST',
      body: JSON.stringify(patch),
    });
  },

  // Authentication & Setup
  async login(credentials: {
    username: string;
    password: string;
    cityName: string;
    role?: UserProfile['role'];
  }): Promise<{ user: UserProfile; token?: string; cityName: string; success: boolean; error?: string; isLive: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        return {
          user: {
            id: '',
            username: credentials.username,
            name: credentials.username,
            role: credentials.role || 'City Architect',
          },
          cityName: credentials.cityName,
          success: false,
          error: json.error || 'Invalid credentials. Please verify your credentials.',
          isLive: true,
        };
      }

      return {
        user: json.user,
        token: json.token,
        cityName: json.cityName || credentials.cityName,
        success: true,
        isLive: true,
      };
    } catch (networkErr) {
      // Prototype mode fallback if backend is unreachable
      const cleanUser = credentials.username.trim();
      const mockUser: UserProfile = {
        id: `usr-${Date.now()}`,
        username: cleanUser,
        name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
        email: `${cleanUser}@aeroagri.city`,
        role: credentials.role || 'City Architect',
        token: `mock-jwt-token-${Date.now()}`,
      };
      return {
        user: mockUser,
        token: mockUser.token,
        cityName: credentials.cityName || 'Nagercoil',
        success: true,
        isLive: false,
      };
    }
  },

  async saveCitySetup(config: { name: string; focusZones: string[]; targetYieldTons: number; solarCapacityKw: number }): Promise<boolean> {
    const res = await safeFetch('/city/setup', { success: true }, {
      method: 'POST',
      body: JSON.stringify(config),
    });
    return !!res;
  },
};
