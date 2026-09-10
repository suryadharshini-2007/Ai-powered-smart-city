import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  selectedCity: string;
  token: string | null;
  isAuthenticated: boolean;
  isBackendLive: boolean;
  login: (credentials: {
    username: string;
    password: string;
    cityName: string;
    role?: UserProfile['role'];
  }) => Promise<{ success: boolean; error?: string; isLive?: boolean }>;
  logout: () => void;
  setSelectedCity: (city: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_CITY_KEY = 'smart_city_selected_city';
const STORAGE_USER_KEY = 'smart_city_user';
const STORAGE_TOKEN_KEY = 'smart_city_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_CITY_KEY) || 'Nagercoil';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
  });

  const [isBackendLive, setIsBackendLive] = useState<boolean>(true);

  const setSelectedCity = (city: string) => {
    const clean = city.trim() || 'Nagercoil';
    setSelectedCityState(clean);
    localStorage.setItem(STORAGE_CITY_KEY, clean);
    window.dispatchEvent(new CustomEvent('smart_city_changed', { detail: { cityName: clean } }));
  };

  const login = async (credentials: {
    username: string;
    password: string;
    cityName: string;
    role?: UserProfile['role'];
  }): Promise<{ success: boolean; error?: string; isLive?: boolean }> => {
    const result = await apiService.login(credentials);

    if (result.success && result.user) {
      setUser(result.user);
      setToken(result.token || 'prototype-token');
      setIsBackendLive(result.isLive);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
      if (result.token) {
        localStorage.setItem(STORAGE_TOKEN_KEY, result.token);
      }

      // Store selected city
      setSelectedCity(result.cityName || credentials.cityName);

      return { success: true, isLive: result.isLive };
    }

    return {
      success: false,
      error: result.error || 'Authentication rejected. Please check your credentials.',
      isLive: result.isLive,
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCity,
        token,
        isAuthenticated: !!user,
        isBackendLive,
        login,
        logout,
        setSelectedCity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
