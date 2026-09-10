import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Wifi,
  Radio,
  Zap,
} from 'lucide-react';
import { SmartCityBackground } from '../components/SmartCityBackground';
import { CitySelector, POPULAR_CITIES } from '../components/CitySelector';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, selectedCity: currentContextCity } = useAuth();

  // Form Inputs
  const [username, setUsername] = useState('overseer');
  const [password, setPassword] = useState('overseer123');
  const [cityName, setCityName] = useState(currentContextCity || 'Nagercoil');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
    cityName?: string;
  }>({});
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [offlineNotice, setOfflineNotice] = useState<boolean>(false);

  // Validate form fields
  const validate = (): boolean => {
    const errors: { username?: string; password?: string; cityName?: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required to access the smart city grid.';
    } else if (username.trim().length < 2) {
      errors.username = 'Username must be at least 2 characters.';
    }

    if (!password) {
      errors.password = 'Password is required to authenticate overseer identity.';
    } else if (password.length < 3) {
      errors.password = 'Password must be at least 3 characters.';
    }

    if (!cityName.trim()) {
      errors.cityName = 'City Name is required to initialize the spatial biosphere.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setOfflineNotice(false);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({
        username: username.trim(),
        password,
        cityName: cityName.trim(),
      });

      if (response.success) {
        setAuthSuccess(true);
        if (response.isLive === false) {
          setOfflineNotice(true);
        }

        // Brief smooth delay to display authenticated state before entering 3D city
        setTimeout(() => {
          navigate('/city');
        }, 750);
      } else {
        setGeneralError(response.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch (err: any) {
      setGeneralError(
        err.message || 'Network error: Unable to contact the smart city authentication gateway.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick preset helper for rapid testing
  const handleQuickCredential = (user: string, pass: string, defaultCity?: string) => {
    setUsername(user);
    setPassword(pass);
    if (defaultCity) setCityName(defaultCity);
    setFieldErrors({});
    setGeneralError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#03070b]">
      {/* 3D Animated Canvas Background: Particles, Moving Data Lines, Grid & Skyline */}
      <SmartCityBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Top Header Badge */}
        <div className="mb-3 flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-950/20 text-xs font-mono text-emerald-300 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2" />
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>AUTONOMOUS BIOSPHERE GATEWAY &bull; SECURE OVERSEER ACCESS</span>
        </div>

        {/* Centered Glass Login Card */}
        <div
          id="smart-city-login-card"
          className="w-full rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_0_50px_-10px_rgba(16,185,129,0.18)] p-6 sm:p-9 transition-all duration-300 animate-in fade-in zoom-in-95 duration-500"
        >
          {/* Card Branding & Title */}
          <div className="text-center mb-7">
            {/* Holographic Logo Emblem */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-400 p-[1.5px] shadow-lg shadow-emerald-500/25 mb-4 group">
              <div className="w-full h-full bg-[#050e14] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors" />
                <Sprout className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1
              id="page-title-heading"
              className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-white sm:whitespace-nowrap"
            >
              AI-POWERED SMART AGRICULTURAL CITY
            </h1>
            <p
              id="page-subtitle"
              className="text-xs sm:text-sm font-medium text-emerald-400/90 tracking-wide mt-1 font-sans"
            >
              Smart &bull; Sustainable &bull; Safe &bull; Connected
            </p>

            {/* Digital Telemetry Ribbon */}
            <div className="mt-3 inline-flex items-center gap-3 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-sky-400">
                <Cpu className="w-3 h-3" />
                Neural OS
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3 h-3" />
                IoT Mesh
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1 text-teal-400">
                <ShieldCheck className="w-3 h-3" />
                bcrypt Encrypted
              </span>
            </div>
          </div>

          {/* Success Notification */}
          {authSuccess && (
            <div
              id="auth-success-banner"
              className="mb-5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2.5 shadow-lg shadow-emerald-500/10 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-200">
                  Authentication Verified &bull; Access Granted
                </p>
                <p className="text-[11px] text-emerald-400/90 mt-0.5">
                  Synchronizing telemetry and launching 3D city scene for{' '}
                  <strong className="text-white">&ldquo;{cityName}&rdquo;</strong>...
                </p>
              </div>
            </div>
          )}

          {/* Offline / Prototype Fallback Notice */}
          {offlineNotice && (
            <div className="mb-4 p-3 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Prototype local authentication engaged. Handshake completed smoothly.</span>
            </div>
          )}

          {/* Error Banner */}
          {generalError && (
            <div
              id="auth-error-banner"
              className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2.5 shadow-lg shadow-rose-950/30 animate-in shake duration-300"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Authentication Alert</p>
                <p className="text-[11px] text-rose-300/90 mt-0.5">{generalError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* 1. USERNAME INPUT */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-username"
                  className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Username</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">Required</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  disabled={isSubmitting || authSuccess}
                  placeholder="Enter overseer username (e.g. overseer)"
                  autoComplete="username"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-white text-sm font-mono placeholder-slate-500 transition-all outline-none backdrop-blur-sm ${
                    fieldErrors.username
                      ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/50'
                      : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50'
                  } ${isSubmitting || authSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>

              {fieldErrors.username && (
                <p id="error-username-msg" className="mt-1 text-xs text-rose-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.username}</span>
                </p>
              )}
            </div>

            {/* 2. PASSWORD INPUT */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-password"
                  className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Password</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">bcrypt encrypted</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={isSubmitting || authSuccess}
                  placeholder="Enter password (e.g. overseer123)"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/80 border text-white text-sm font-mono placeholder-slate-500 transition-all outline-none backdrop-blur-sm ${
                    fieldErrors.password
                      ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/50'
                      : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50'
                  } ${isSubmitting || authSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />

                {/* Show / Hide Password Toggle */}
                <button
                  id="btn-toggle-password-visibility"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || authSuccess}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <p id="error-password-msg" className="mt-1 text-xs text-rose-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* 3. CITY NAME INPUT (Searchable, selectable, and custom editable) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="city-input-field"
                  className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. City Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-400">Search or type custom</span>
              </div>

              <CitySelector
                value={cityName}
                onChange={(newCity) => {
                  setCityName(newCity);
                  if (fieldErrors.cityName) setFieldErrors((prev) => ({ ...prev, cityName: undefined }));
                }}
                error={fieldErrors.cityName}
                disabled={isSubmitting || authSuccess}
              />

              {fieldErrors.cityName && (
                <p id="error-city-msg" className="mt-1 text-xs text-rose-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.cityName}</span>
                </p>
              )}

              {/* Quick City Shortcut Chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 mr-1">Quick Select:</span>
                {['Nagercoil', 'AeroAgri Neo-Metropolis', 'Kyoto Eco-Harbor', 'Songdo Green District'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCityName(c);
                      if (fieldErrors.cityName) setFieldErrors((prev) => ({ ...prev, cityName: undefined }));
                    }}
                    disabled={isSubmitting || authSuccess}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                      cityName.toLowerCase().trim() === c.toLowerCase().trim()
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {c.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Prototype Accounts Bar */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Demo Overseer Accounts:
                </span>
                <span className="text-[10px] font-mono text-slate-400">One-click populate</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickCredential('overseer', 'overseer123', 'Nagercoil')}
                  disabled={isSubmitting || authSuccess}
                  className="px-2 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 hover:text-emerald-300 text-center transition-all"
                >
                  <div className="font-semibold text-white">overseer</div>
                  <div className="text-[9px] text-emerald-400">City Architect</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCredential('agronomist', 'agri2026password', 'AeroAgri Neo-Metropolis')}
                  disabled={isSubmitting || authSuccess}
                  className="px-2 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 hover:text-emerald-300 text-center transition-all"
                >
                  <div className="font-semibold text-white">agronomist</div>
                  <div className="text-[9px] text-teal-400">Agronomist</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCredential('admin', 'admin123', 'Nagercoil')}
                  disabled={isSubmitting || authSuccess}
                  className="px-2 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 hover:text-emerald-300 text-center transition-all"
                >
                  <div className="font-semibold text-white">admin</div>
                  <div className="text-[9px] text-sky-400">Systems Root</div>
                </button>
              </div>
            </div>

            {/* 4. LOGIN BUTTON */}
            <div className="pt-2">
              <button
                id="btn-enter-smart-city"
                type="submit"
                disabled={isSubmitting || authSuccess}
                className={`relative w-full py-3.5 px-6 rounded-2xl font-heading font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl overflow-hidden group ${
                  authSuccess
                    ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                    : isSubmitting
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-none cursor-wait'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {/* Glow shimmer line */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span>Establishing Biosphere Handshake...</span>
                  </>
                ) : authSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>Entering {cityName}...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER SMART CITY</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer security note */}
          <div className="mt-5 pt-4 border-t border-slate-900/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 &bull; SHA-256</span>
            </span>
            <span>Target: <strong className="text-slate-300">{cityName || 'Not Set'}</strong></span>
          </div>
        </div>

        {/* Footnote status */}
        <div className="mt-4 text-center text-xs font-mono text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>AI-POWERED SMART AGRICULTURAL CITY SYSTEM &bull; PAGE 1 GATEWAY</span>
        </div>
      </div>
    </div>
  );
};
