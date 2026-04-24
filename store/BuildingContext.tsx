import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Building, Floor } from '../types/building';
import { FACADE_PALETTES } from '../constants/colors';

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultFloors(count: number): Floor[] {
  return Array.from({ length: count }, () => ({ windowStyle: 'single' as const, hasBalcony: false }));
}

export function createDefaultBuilding(): Building {
  return {
    id: makeId(),
    name: 'My Building',
    category: 'residential',
    floors: defaultFloors(6),
    width: 'medium',
    facadeColor: FACADE_PALETTES.classic[0],
    accentColor: '#FFFFFF',
    material: 'brick',
    roofStyle: 'flat',
    groundFloor: 'door',
    roofColor: '#37474F',
  };
}

interface BuildingContextValue {
  buildings: Building[];
  activeBuilding: Building;
  setActiveBuilding: (b: Building) => void;
  updateActiveBuilding: (patch: Partial<Building>) => void;
  updateFloor: (index: number, patch: Partial<Floor>) => void;
  saveBuilding: () => void;
  deleteBuilding: (id: string) => void;
  newBuilding: () => void;
  loadBuilding: (id: string) => void;
}

const BuildingContext = createContext<BuildingContextValue | null>(null);

export function BuildingProvider({ children }: { children: React.ReactNode }) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [activeBuilding, setActiveBuilding] = useState<Building>(createDefaultBuilding);

  const updateActiveBuilding = useCallback((patch: Partial<Building>) => {
    setActiveBuilding(prev => ({ ...prev, ...patch }));
  }, []);

  const updateFloor = useCallback((index: number, patch: Partial<Floor>) => {
    setActiveBuilding(prev => {
      const floors = prev.floors.map((f, i) => i === index ? { ...f, ...patch } : f);
      return { ...prev, floors };
    });
  }, []);

  const saveBuilding = useCallback(() => {
    setBuildings(prev => {
      const exists = prev.find(b => b.id === activeBuilding.id);
      if (exists) return prev.map(b => b.id === activeBuilding.id ? activeBuilding : b);
      return [...prev, activeBuilding];
    });
  }, [activeBuilding]);

  const deleteBuilding = useCallback((id: string) => {
    setBuildings(prev => prev.filter(b => b.id !== id));
  }, []);

  const newBuilding = useCallback(() => {
    setActiveBuilding(createDefaultBuilding());
  }, []);

  const loadBuilding = useCallback((id: string) => {
    const b = buildings.find(b => b.id === id);
    if (b) setActiveBuilding({ ...b });
  }, [buildings]);

  return (
    <BuildingContext.Provider value={{
      buildings, activeBuilding, setActiveBuilding,
      updateActiveBuilding, updateFloor,
      saveBuilding, deleteBuilding, newBuilding, loadBuilding,
    }}>
      {children}
    </BuildingContext.Provider>
  );
}

export function useBuilding() {
  const ctx = useContext(BuildingContext);
  if (!ctx) throw new Error('useBuilding must be used within BuildingProvider');
  return ctx;
}
