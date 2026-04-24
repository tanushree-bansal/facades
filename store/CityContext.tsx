import React, { createContext, useContext, useState, useCallback } from 'react';
import type { City, CityTheme, SkylineSlot } from '../types/building';
import { SKYLINE_SLOTS } from '../constants/buildingElements';

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptySlots(): SkylineSlot[] {
  return Array.from({ length: SKYLINE_SLOTS }, (_, i) => ({ position: i, buildingId: null }));
}

interface CityContextValue {
  city: City;
  updateCity: (patch: Partial<City>) => void;
  placeBuilding: (position: number, buildingId: string) => void;
  removeBuilding: (position: number) => void;
  setTheme: (theme: CityTheme) => void;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<City>({
    id: makeId(),
    name: 'My City',
    skyline: emptySlots(),
    theme: 'modern',
  });

  const updateCity = useCallback((patch: Partial<City>) => {
    setCity(prev => ({ ...prev, ...patch }));
  }, []);

  const placeBuilding = useCallback((position: number, buildingId: string) => {
    setCity(prev => ({
      ...prev,
      skyline: prev.skyline.map(s => s.position === position ? { ...s, buildingId } : s),
    }));
  }, []);

  const removeBuilding = useCallback((position: number) => {
    setCity(prev => ({
      ...prev,
      skyline: prev.skyline.map(s => s.position === position ? { ...s, buildingId: null } : s),
    }));
  }, []);

  const setTheme = useCallback((theme: CityTheme) => {
    setCity(prev => ({ ...prev, theme }));
  }, []);

  return (
    <CityContext.Provider value={{ city, updateCity, placeBuilding, removeBuilding, setTheme }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be used within CityProvider');
  return ctx;
}
