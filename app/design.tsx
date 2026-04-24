import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import BuildingRenderer from '../components/building/BuildingRenderer';
import ColorPalette from '../components/ui/ColorPalette';
import ChipSelector from '../components/ui/ChipSelector';
import SectionLabel from '../components/ui/SectionLabel';
import { useBuilding } from '../store/BuildingContext';
import { UI, FACADE_PALETTES, ACCENT_COLORS, ROOF_COLORS } from '../constants/colors';
import {
  WINDOW_STYLES, ROOF_STYLES, MATERIALS,
  GROUND_FLOORS, BUILDING_WIDTHS, MIN_FLOORS, MAX_FLOORS,
} from '../constants/buildingElements';
import type { WindowStyle } from '../types/building';

type Tab = 'facade' | 'floors' | 'roof' | 'details';

const TABS: { id: Tab; label: string }[] = [
  { id: 'facade',  label: 'Facade'  },
  { id: 'floors',  label: 'Floors'  },
  { id: 'roof',    label: 'Roof'    },
  { id: 'details', label: 'Details' },
];

export default function DesignScreen() {
  const router = useRouter();
  const { activeBuilding, updateActiveBuilding, updateFloor, saveBuilding } = useBuilding();
  const [tab, setTab] = useState<Tab>('facade');
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof FACADE_PALETTES>('classic');
  const [selectedFloor, setSelectedFloor] = useState(0);

  function handleSave() {
    saveBuilding();
    Alert.alert('Saved!', `"${activeBuilding.name}" has been saved to your collection.`, [
      { text: 'Keep Editing' },
      { text: 'Go Home', onPress: () => router.back() },
    ]);
  }

  function adjustFloors(delta: number) {
    const current = activeBuilding.floors.length;
    const next = Math.max(MIN_FLOORS, Math.min(MAX_FLOORS, current + delta));
    if (next === current) return;
    if (next > current) {
      updateActiveBuilding({
        floors: [
          ...activeBuilding.floors,
          ...Array.from({ length: next - current }, () => ({
            windowStyle: 'single' as WindowStyle,
            hasBalcony: false,
          })),
        ],
      });
    } else {
      updateActiveBuilding({ floors: activeBuilding.floors.slice(0, next) });
    }
  }

  const allFlats = FACADE_PALETTES[selectedPalette];

  return (
    <View style={styles.container}>
      {/* Preview */}
      <View style={styles.preview}>
        <BuildingRenderer building={activeBuilding} scale={1.2} />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}
          >
            <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Editor panel */}
      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>

        {tab === 'facade' && (
          <>
            <SectionLabel>Palette</SectionLabel>
            <ChipSelector
              options={Object.keys(FACADE_PALETTES).map(k => ({ id: k, label: k.charAt(0).toUpperCase() + k.slice(1) }))}
              selected={selectedPalette}
              onSelect={k => setSelectedPalette(k as keyof typeof FACADE_PALETTES)}
            />
            <SectionLabel>Facade Color</SectionLabel>
            <ColorPalette
              colors={allFlats}
              selected={activeBuilding.facadeColor}
              onSelect={c => updateActiveBuilding({ facadeColor: c })}
            />
            <SectionLabel>Accent / Window Color</SectionLabel>
            <ColorPalette
              colors={ACCENT_COLORS}
              selected={activeBuilding.accentColor}
              onSelect={c => updateActiveBuilding({ accentColor: c })}
            />
            <SectionLabel>Material</SectionLabel>
            <ChipSelector
              options={MATERIALS.map(m => ({ id: m.id, label: m.label }))}
              selected={activeBuilding.material}
              onSelect={m => updateActiveBuilding({ material: m as any })}
            />
            <SectionLabel>Building Width</SectionLabel>
            <ChipSelector
              options={BUILDING_WIDTHS.map(w => ({ id: w.id, label: w.label }))}
              selected={activeBuilding.width}
              onSelect={w => updateActiveBuilding({ width: w as any })}
            />
          </>
        )}

        {tab === 'floors' && (
          <>
            <SectionLabel>Number of Floors</SectionLabel>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustFloors(-1)}>
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepValue}>{activeBuilding.floors.length}</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustFloors(1)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <SectionLabel>Select Floor to Edit</SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.floorPicker}>
                {activeBuilding.floors.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.floorBtn, selectedFloor === i && styles.floorBtnActive]}
                    onPress={() => setSelectedFloor(i)}
                  >
                    <Text style={[styles.floorBtnText, selectedFloor === i && styles.floorBtnTextActive]}>
                      {activeBuilding.floors.length - i}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <SectionLabel>Window Style (Floor {activeBuilding.floors.length - selectedFloor})</SectionLabel>
            <ChipSelector
              options={WINDOW_STYLES.map(w => ({ id: w.id, label: w.label, icon: w.icon }))}
              selected={activeBuilding.floors[selectedFloor]?.windowStyle ?? 'single'}
              onSelect={s => updateFloor(selectedFloor, { windowStyle: s as WindowStyle })}
            />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Balcony</Text>
              <Switch
                value={activeBuilding.floors[selectedFloor]?.hasBalcony ?? false}
                onValueChange={v => updateFloor(selectedFloor, { hasBalcony: v })}
                trackColor={{ false: UI.border, true: UI.accent }}
                thumbColor="#FFF"
              />
            </View>

            <SectionLabel>Apply Window Style to All Floors</SectionLabel>
            <ChipSelector
              options={WINDOW_STYLES.map(w => ({ id: w.id, label: w.label }))}
              selected=""
              onSelect={s => {
                activeBuilding.floors.forEach((_, i) =>
                  updateFloor(i, { windowStyle: s as WindowStyle })
                );
              }}
            />
          </>
        )}

        {tab === 'roof' && (
          <>
            <SectionLabel>Roof Style</SectionLabel>
            <ChipSelector
              options={ROOF_STYLES}
              selected={activeBuilding.roofStyle}
              onSelect={r => updateActiveBuilding({ roofStyle: r as any })}
            />
            <SectionLabel>Roof Color</SectionLabel>
            <ColorPalette
              colors={ROOF_COLORS}
              selected={activeBuilding.roofColor}
              onSelect={c => updateActiveBuilding({ roofColor: c })}
            />
          </>
        )}

        {tab === 'details' && (
          <>
            <SectionLabel>Building Name</SectionLabel>
            <TextInput
              style={styles.nameInput}
              value={activeBuilding.name}
              onChangeText={t => updateActiveBuilding({ name: t })}
              placeholder="Enter a name…"
              placeholderTextColor={UI.textMuted}
            />
            <SectionLabel>Category</SectionLabel>
            <ChipSelector
              options={[
                { id: 'residential', label: '🏠 Residential' },
                { id: 'commercial',  label: '🏢 Commercial'  },
                { id: 'industrial',  label: '🏭 Industrial'  },
                { id: 'landmark',    label: '🏛️ Landmark'    },
              ]}
              selected={activeBuilding.category}
              onSelect={c => updateActiveBuilding({ category: c as any })}
            />
            <SectionLabel>Ground Floor</SectionLabel>
            <ChipSelector
              options={GROUND_FLOORS}
              selected={activeBuilding.groundFloor}
              onSelect={g => updateActiveBuilding({ groundFloor: g as any })}
            />
          </>
        )}
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Building</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.background },

  preview: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    backgroundColor: UI.surface,
    minHeight: 180,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: UI.surface,
    borderBottomWidth: 1,
    borderBottomColor: UI.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: UI.accent,
  },
  tabLabel: {
    fontSize: 13,
    color: UI.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: UI.accent,
    fontWeight: '700',
  },

  panel: { flex: 1 },
  panelContent: { padding: 20, paddingBottom: 8 },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UI.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: UI.border,
  },
  stepBtnText: { fontSize: 22, color: UI.text, fontWeight: '700' },
  stepValue: { fontSize: 24, fontWeight: '800', color: UI.text, minWidth: 40, textAlign: 'center' },

  floorPicker: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  floorBtn: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: UI.surface, alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: UI.border,
  },
  floorBtnActive: { backgroundColor: UI.accent, borderColor: UI.accent },
  floorBtnText: { fontSize: 12, color: UI.textMuted },
  floorBtnTextActive: { color: '#FFF', fontWeight: '700' },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 4,
  },
  toggleLabel: { color: UI.text, fontSize: 15 },

  nameInput: {
    backgroundColor: UI.surface,
    borderRadius: 10,
    padding: 14,
    color: UI.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: UI.border,
  },

  saveBtn: {
    margin: 16,
    backgroundColor: UI.accent,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
