import type { WindowStyle, RoofStyle, Material, GroundFloorStyle, BuildingCategory } from '../types/building';

export const WINDOW_STYLES: { id: WindowStyle; label: string; icon: string }[] = [
  { id: 'single',    label: 'Single',    icon: '▪' },
  { id: 'double',    label: 'Double',    icon: '▪▪' },
  { id: 'arched',    label: 'Arched',    icon: '⌒' },
  { id: 'panoramic', label: 'Panoramic', icon: '▬' },
  { id: 'none',      label: 'Solid',     icon: '■' },
];

export const ROOF_STYLES: { id: RoofStyle; label: string }[] = [
  { id: 'flat',    label: 'Flat' },
  { id: 'peaked',  label: 'Peaked' },
  { id: 'dome',    label: 'Dome' },
  { id: 'stepped', label: 'Stepped' },
  { id: 'modern',  label: 'Modern' },
];

export const MATERIALS: { id: Material; label: string; texture: string }[] = [
  { id: 'brick',    label: 'Brick',    texture: '#C1440E' },
  { id: 'concrete', label: 'Concrete', texture: '#9E9E9E' },
  { id: 'glass',    label: 'Glass',    texture: '#B3E5FC' },
  { id: 'stone',    label: 'Stone',    texture: '#78909C' },
  { id: 'wood',     label: 'Wood',     texture: '#8D6E63' },
];

export const GROUND_FLOORS: { id: GroundFloorStyle; label: string }[] = [
  { id: 'door',      label: 'Door' },
  { id: 'shopfront', label: 'Shopfront' },
  { id: 'garage',    label: 'Garage' },
  { id: 'arch',      label: 'Arch' },
];

export const BUILDING_WIDTHS = [
  { id: 'narrow' as const, label: 'Narrow', columns: 2 },
  { id: 'medium' as const, label: 'Medium', columns: 3 },
  { id: 'wide'   as const, label: 'Wide',   columns: 4 },
];

export const CATEGORIES: { id: BuildingCategory; label: string; emoji: string }[] = [
  { id: 'residential', label: 'Residential', emoji: '🏠' },
  { id: 'commercial',  label: 'Commercial',  emoji: '🏢' },
  { id: 'industrial',  label: 'Industrial',  emoji: '🏭' },
  { id: 'landmark',    label: 'Landmark',    emoji: '🏛️' },
];

export const MIN_FLOORS = 2;
export const MAX_FLOORS = 20;
export const SKYLINE_SLOTS = 8;
