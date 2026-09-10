import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, Sparkles, X } from 'lucide-react';
import { CityPreset } from '../types';

export const POPULAR_CITIES: CityPreset[] = [
  {
    id: 'nagercoil',
    name: 'Nagercoil',
    region: 'Tamil Nadu, Southern Peninsula',
    focus: 'Wind-Solar Agri-Corridor & Coconut Biosphere',
    badge: 'Eco-Wind Corridor',
  },
  {
    id: 'aeroagri',
    name: 'AeroAgri Neo-Metropolis',
    region: 'Central Biosphere Sector',
    focus: 'Autonomous Aeroponics & Heliostat Energy Grid',
    badge: 'Flagship Biosphere',
  },
  {
    id: 'songdo',
    name: 'Songdo Green District',
    region: 'Incheon Coastal Plain',
    focus: 'Pneumatic Waste & Ubiquitous Sensor Grid',
    badge: 'Smart Ubiquitous',
  },
  {
    id: 'kyoto',
    name: 'Kyoto Eco-Harbor',
    region: 'Kansai River Basin',
    focus: 'Circadian Hydroponic Precision Agriculture',
    badge: 'Hydro-Precision',
  },
  {
    id: 'curitiba',
    name: 'Curitiba Bio-Corridor',
    region: 'Paraná Plateau',
    focus: 'Urban Permaculture & Closed-Loop Transit',
    badge: 'Circular Eco-Hub',
  },
  {
    id: 'singapore',
    name: 'Singapore Sky Greens Basin',
    region: 'Equatorial Urban Belt',
    focus: 'Vertical Agro-Towers & High-Yield Micro-Algae',
    badge: 'Vertical Agro-Tower',
  },
  {
    id: 'albaydha',
    name: 'Al-Baydha Regenerative Oasis',
    region: 'Arid Valley Basin',
    focus: 'Hyper-Arid Terracing & Subsurface Drip Matrix',
    badge: 'Desert Re-greening',
  },
  {
    id: 'wageningen',
    name: 'Wageningen Agri-Tech Valley',
    region: 'Gelderland Delta',
    focus: 'Autonomous AI Robotics & Phenotyping Glasshouses',
    badge: 'Robotic Greenhouses',
  },
];

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  error?: string;
  disabled?: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize searchQuery with value when value changes externally
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = POPULAR_CITIES.filter((city) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      city.name.toLowerCase().includes(q) ||
      city.region.toLowerCase().includes(q) ||
      city.focus.toLowerCase().includes(q)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelectCity = (cityName: string) => {
    setSearchQuery(cityName);
    onChange(cityName);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery('');
    onChange('');
    inputRef.current?.focus();
  };

  const exactMatchExists = POPULAR_CITIES.some(
    (c) => c.name.toLowerCase() === searchQuery.toLowerCase().trim()
  );

  return (
    <div ref={containerRef} className="relative w-full text-left">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
          <MapPin className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          id="city-input-field"
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder="Search city or type custom (e.g. Nagercoil)"
          autoComplete="off"
          className={`w-full pl-10 pr-16 py-2.5 rounded-xl bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm font-medium transition-all outline-none backdrop-blur-sm ${
            error
              ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/50'
              : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 shadow-inner'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
          {searchQuery && !disabled && (
            <button
              type="button"
              id="clear-city-btn"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            id="toggle-city-dropdown-btn"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
            title="Browse smart cities"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          id="city-selector-dropdown"
          className="absolute left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800/90 shadow-2xl z-50 p-2 divide-y divide-slate-900/60 custom-scrollbar animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Select or Type City Name
            </span>
            <span className="text-[10px] text-slate-400">
              {filteredCities.length} preset{filteredCities.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Custom typed option if user typed something not matching any existing item */}
          {searchQuery.trim() && !exactMatchExists && (
            <div className="p-1">
              <button
                type="button"
                id="select-custom-city-btn"
                onClick={() => handleSelectCity(searchQuery.trim())}
                className="w-full text-left px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Use custom city: <strong>&ldquo;{searchQuery.trim()}&rdquo;</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Custom
                </span>
              </button>
            </div>
          )}

          {/* Preset list */}
          <div className="p-1 space-y-1">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = value.toLowerCase().trim() === city.name.toLowerCase().trim();
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelectCity(city.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                        : 'hover:bg-slate-900/90 text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white tracking-wide">
                          {city.name}
                        </span>
                        {city.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                            {city.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{city.region}</p>
                      <p className="text-[10px] text-emerald-400/80 mt-0.5 line-clamp-1">{city.focus}</p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })
            ) : !searchQuery.trim() ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No cities found
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
