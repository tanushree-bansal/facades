# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server (scan QR with Expo Go)
npm run ios        # Open in iOS simulator
npm run android    # Open in Android emulator
npm run web        # Open in browser
```

There are no tests or linters configured yet.

## Git Workflow

After every feature or fix: commit with a conventional message and push to `origin/main`.

```
feat: add X
fix: correct Y
chore: update Z
```

GitHub repo: https://github.com/tanushree-bansal/facades

## Architecture

### Navigation (expo-router file-based)
`app/_layout.tsx` is the root — it wraps everything in `GestureHandlerRootView`, `BuildingProvider`, and `CityProvider`, then declares a `Stack` navigator. Adding a new screen means creating `app/yourscreen.tsx` and registering it in `_layout.tsx`.

### State
All state is in-memory React Context (no persistence yet):

- **`BuildingContext`** (`store/BuildingContext.tsx`) — owns the `buildings[]` collection and `activeBuilding`. The designer screen always edits `activeBuilding`; `saveBuilding()` upserts it into the collection by `id`. Call `newBuilding()` before navigating to `/design` to start fresh, or `loadBuilding(id)` to edit an existing one.
- **`CityContext`** (`store/CityContext.tsx`) — owns a single `City` with 8 `SkylineSlot[]` positions. Each slot holds a `buildingId` reference into the `BuildingContext` collection.

### Building data model (`types/building.ts`)
A `Building` has:
- `floors: Floor[]` — array ordered top→bottom; each floor has `windowStyle` and `hasBalcony`
- `width: 'narrow' | 'medium' | 'wide'` — maps to 2/3/4 SVG columns via `BUILDING_WIDTHS` in `constants/buildingElements.ts`
- `facadeColor`, `accentColor`, `roofColor` — hex strings
- `roofStyle`, `groundFloor`, `material`, `category` — string union types defined in the same file

### SVG Rendering (`components/building/BuildingRenderer.tsx`)
Buildings are rendered entirely as SVG using `react-native-svg`. Layout constants are at the top of the file: `FLOOR_H=28`, `UNIT=24` (per column width), `ROOF_H=22`, `GROUND_H=36`. The SVG viewBox is computed from floor count and column count; pass a `scale` prop to resize without changing the viewBox. Floors are stored top→bottom but rendered in the same order — floor `0` is the top floor visually.

### Constants
- `constants/colors.ts` — all color values including the `UI` theme object (dark navy palette, `UI.accent = #E94560`)
- `constants/buildingElements.ts` — option arrays for every building property, plus `MIN_FLOORS=2`, `MAX_FLOORS=20`, `SKYLINE_SLOTS=8`

### Adding a new building property
1. Add the type to `types/building.ts`
2. Add option constants to `constants/buildingElements.ts`
3. Add a default value in `createDefaultBuilding()` in `store/BuildingContext.tsx`
4. Handle it in `BuildingRenderer.tsx` if it affects visuals
5. Expose editing UI in `app/design.tsx`
