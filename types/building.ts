export type WindowStyle = 'single' | 'double' | 'arched' | 'panoramic' | 'none';
export type RoofStyle = 'flat' | 'peaked' | 'dome' | 'stepped' | 'modern';
export type Material = 'brick' | 'concrete' | 'glass' | 'stone' | 'wood';
export type GroundFloorStyle = 'door' | 'shopfront' | 'garage' | 'arch';
export type BuildingCategory = 'residential' | 'commercial' | 'industrial' | 'landmark';

export interface Floor {
  windowStyle: WindowStyle;
  hasBalcony: boolean;
}

export interface Building {
  id: string;
  name: string;
  category: BuildingCategory;
  floors: Floor[];
  width: 'narrow' | 'medium' | 'wide';
  facadeColor: string;
  accentColor: string;
  material: Material;
  roofStyle: RoofStyle;
  groundFloor: GroundFloorStyle;
  roofColor: string;
}

export interface SkylineSlot {
  position: number;
  buildingId: string | null;
}

export interface City {
  id: string;
  name: string;
  skyline: SkylineSlot[];
  theme: CityTheme;
}

export type CityTheme = 'modern' | 'historic' | 'futuristic' | 'coastal' | 'industrial';
