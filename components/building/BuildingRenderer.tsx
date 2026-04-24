import React from 'react';
import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { Building, WindowStyle, RoofStyle } from '../../types/building';
import { BUILDING_WIDTHS } from '../../constants/buildingElements';

const FLOOR_H = 28;
const UNIT = 24;
const ROOF_H = 22;
const GROUND_H = 36;
const WINDOW_MARGIN = 4;

function getColumns(width: Building['width']) {
  return BUILDING_WIDTHS.find(w => w.id === width)?.columns ?? 3;
}

function Window({ x, y, w, h, style, accentColor }: {
  x: number; y: number; w: number; h: number;
  style: WindowStyle; accentColor: string;
}) {
  const ww = w - WINDOW_MARGIN * 2;
  const wh = h - WINDOW_MARGIN * 2;
  const wx = x + WINDOW_MARGIN;
  const wy = y + WINDOW_MARGIN;

  if (style === 'none') return null;

  if (style === 'arched') {
    const r = ww / 2;
    return (
      <G>
        <Rect x={wx} y={wy + r} width={ww} height={wh - r} fill={accentColor} opacity={0.85} />
        <Circle cx={wx + r} cy={wy + r} r={r} fill={accentColor} opacity={0.85} />
      </G>
    );
  }

  if (style === 'double') {
    const hw = (ww - 2) / 2;
    return (
      <G>
        <Rect x={wx} y={wy} width={hw} height={wh} fill={accentColor} opacity={0.85} rx={1} />
        <Rect x={wx + hw + 2} y={wy} width={hw} height={wh} fill={accentColor} opacity={0.85} rx={1} />
      </G>
    );
  }

  if (style === 'panoramic') {
    return <Rect x={wx} y={wy + wh * 0.3} width={ww} height={wh * 0.5} fill={accentColor} opacity={0.9} rx={1} />;
  }

  return <Rect x={wx} y={wy} width={ww} height={wh} fill={accentColor} opacity={0.85} rx={1} />;
}

function Roof({ x, y, bw, style, color }: {
  x: number; y: number; bw: number; style: RoofStyle; color: string;
}) {
  if (style === 'flat') {
    return <Rect x={x} y={y} width={bw} height={6} fill={color} />;
  }
  if (style === 'peaked') {
    return <Path d={`M${x} ${y + ROOF_H} L${x + bw / 2} ${y} L${x + bw} ${y + ROOF_H} Z`} fill={color} />;
  }
  if (style === 'dome') {
    return (
      <G>
        <Rect x={x} y={y + ROOF_H - 4} width={bw} height={4} fill={color} />
        <Path
          d={`M${x} ${y + ROOF_H} Q${x + bw / 2} ${y - 10} ${x + bw} ${y + ROOF_H}`}
          fill={color}
        />
      </G>
    );
  }
  if (style === 'stepped') {
    const s = bw / 4;
    return (
      <G>
        <Rect x={x} y={y + ROOF_H - 6} width={bw} height={6} fill={color} />
        <Rect x={x + s * 0.5} y={y + ROOF_H - 12} width={bw - s} height={6} fill={color} />
        <Rect x={x + s} y={y + ROOF_H - 18} width={bw - s * 2} height={6} fill={color} />
      </G>
    );
  }
  // modern
  return (
    <G>
      <Rect x={x} y={y + ROOF_H - 8} width={bw} height={8} fill={color} />
      <Rect x={x + bw * 0.3} y={y} width={bw * 0.4} height={ROOF_H - 8} fill={color} />
    </G>
  );
}

function GroundFloor({ x, y, bw, style, facadeColor, accentColor }: {
  x: number; y: number; bw: number;
  style: Building['groundFloor'];
  facadeColor: string; accentColor: string;
}) {
  const doorW = bw * 0.25;
  const doorH = GROUND_H * 0.7;
  const doorX = x + (bw - doorW) / 2;
  const doorY = y + GROUND_H - doorH;

  if (style === 'shopfront') {
    return (
      <G>
        <Rect x={x} y={y} width={bw} height={GROUND_H} fill={facadeColor} />
        <Rect x={x + 2} y={y + 4} width={bw - 4} height={GROUND_H * 0.5} fill={accentColor} opacity={0.7} />
        <Rect x={doorX} y={doorY} width={doorW} height={doorH} fill={accentColor} opacity={0.9} />
      </G>
    );
  }
  if (style === 'garage') {
    return (
      <G>
        <Rect x={x} y={y} width={bw} height={GROUND_H} fill={facadeColor} />
        <Rect x={x + 4} y={y + 6} width={bw - 8} height={GROUND_H - 6} fill={accentColor} opacity={0.6} rx={2} />
      </G>
    );
  }
  if (style === 'arch') {
    const aw = bw * 0.4;
    const ax = x + (bw - aw) / 2;
    return (
      <G>
        <Rect x={x} y={y} width={bw} height={GROUND_H} fill={facadeColor} />
        <Rect x={ax} y={y + GROUND_H / 2} width={aw} height={GROUND_H / 2} fill={accentColor} opacity={0.85} />
        <Circle cx={ax + aw / 2} cy={y + GROUND_H / 2} r={aw / 2} fill={accentColor} opacity={0.85} />
      </G>
    );
  }
  return (
    <G>
      <Rect x={x} y={y} width={bw} height={GROUND_H} fill={facadeColor} />
      <Rect x={doorX} y={doorY} width={doorW} height={doorH} fill={accentColor} opacity={0.9} rx={1} />
    </G>
  );
}

interface Props {
  building: Building;
  scale?: number;
}

export default function BuildingRenderer({ building, scale = 1 }: Props) {
  const cols = getColumns(building.width);
  const bw = cols * UNIT;
  const totalH = building.floors.length * FLOOR_H + GROUND_H + ROOF_H;
  const svgW = bw + 8;
  const svgH = totalH + 8;

  return (
    <Svg width={svgW * scale} height={svgH * scale} viewBox={`0 0 ${svgW} ${svgH}`}>
      <Defs>
        <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#87CEEB" stopOpacity="1" />
          <Stop offset="1" stopColor="#E0F0FF" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Roof */}
      <Roof
        x={4} y={4}
        bw={bw}
        style={building.roofStyle}
        color={building.roofColor}
      />

      {/* Floors (rendered bottom-up) */}
      {building.floors.map((floor, i) => {
        const floorIndex = building.floors.length - 1 - i;
        const fy = 4 + ROOF_H + i * FLOOR_H;
        return (
          <G key={floorIndex}>
            <Rect x={4} y={fy} width={bw} height={FLOOR_H} fill={building.facadeColor} />
            {Array.from({ length: cols }).map((_, col) => (
              <Window
                key={col}
                x={4 + col * UNIT}
                y={fy}
                w={UNIT}
                h={FLOOR_H}
                style={floor.windowStyle}
                accentColor={building.accentColor}
              />
            ))}
            {floor.hasBalcony && (
              <Rect
                x={4}
                y={fy + FLOOR_H - 4}
                width={bw}
                height={4}
                fill={building.accentColor}
                opacity={0.5}
              />
            )}
          </G>
        );
      })}

      {/* Ground floor */}
      <GroundFloor
        x={4}
        y={4 + ROOF_H + building.floors.length * FLOOR_H}
        bw={bw}
        style={building.groundFloor}
        facadeColor={building.facadeColor}
        accentColor={building.accentColor}
      />
    </Svg>
  );
}
