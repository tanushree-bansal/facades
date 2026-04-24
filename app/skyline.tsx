import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, FlatList,
} from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';
import BuildingRenderer from '../components/building/BuildingRenderer';
import ChipSelector from '../components/ui/ChipSelector';
import { useBuilding } from '../store/BuildingContext';
import { useCity } from '../store/CityContext';
import { UI, SKY_COLORS, GROUND_COLORS } from '../constants/colors';
import { SKYLINE_SLOTS } from '../constants/buildingElements';
import type { CityTheme } from '../types/building';

type SkyCondition = keyof typeof SKY_COLORS;
type GroundType = keyof typeof GROUND_COLORS;

const THEMES: { id: CityTheme; label: string }[] = [
  { id: 'modern',     label: 'Modern'     },
  { id: 'historic',   label: 'Historic'   },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'coastal',    label: 'Coastal'    },
  { id: 'industrial', label: 'Industrial' },
];

export default function SkylineScreen() {
  const { buildings } = useBuilding();
  const { city, placeBuilding, removeBuilding, setTheme } = useCity();
  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [sky, setSky] = useState<SkyCondition>('day');
  const [ground, setGround] = useState<GroundType>('asphalt');

  const skyColor = SKY_COLORS[sky];
  const groundColor = GROUND_COLORS[ground];

  function handleSlotPress(position: number) {
    const slot = city.skyline.find(s => s.position === position);
    if (slot?.buildingId) {
      removeBuilding(position);
    } else {
      setPickingSlot(position);
    }
  }

  function handlePickBuilding(buildingId: string) {
    if (pickingSlot !== null) {
      placeBuilding(pickingSlot, buildingId);
      setPickingSlot(null);
    }
  }

  const buildingMap = Object.fromEntries(buildings.map(b => [b.id, b]));

  return (
    <View style={styles.container}>
      {/* Sky canvas */}
      <View style={[styles.sky, { backgroundColor: skyColor.bottom }]}>
        <View style={[styles.skyTop, { backgroundColor: skyColor.top }]} />

        {/* Stars for night */}
        {sky === 'night' && (
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            {[[30,20],[80,10],[140,30],[200,15],[260,25],[320,8],[350,35]].map(([x,y],i)=>(
              <Circle key={i} cx={x} cy={y} r={1.5} fill="#FFF" opacity={0.8} />
            ))}
          </Svg>
        )}

        {/* Skyline slots */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slotsRow}
        >
          {Array.from({ length: SKYLINE_SLOTS }).map((_, i) => {
            const slot = city.skyline.find(s => s.position === i);
            const building = slot?.buildingId ? buildingMap[slot.buildingId] : null;
            return (
              <TouchableOpacity
                key={i}
                style={styles.slot}
                onPress={() => handleSlotPress(i)}
                activeOpacity={0.8}
              >
                {building ? (
                  <BuildingRenderer building={building} scale={0.7} />
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.emptySlotPlus}>+</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Ground strip */}
        <View style={[styles.ground, { backgroundColor: groundColor }]} />
      </View>

      {/* Controls */}
      <ScrollView style={styles.controls} contentContainerStyle={styles.controlsContent}>
        <Text style={styles.hint}>
          {buildings.length === 0
            ? 'Design and save buildings first, then place them here.'
            : 'Tap a slot to add a building. Tap a placed building to remove it.'}
        </Text>

        <Text style={styles.sectionLabel}>SKY</Text>
        <ChipSelector
          options={[
            { id: 'day',      label: '☀️ Day'      },
            { id: 'sunset',   label: '🌅 Sunset'   },
            { id: 'night',    label: '🌙 Night'    },
            { id: 'overcast', label: '☁️ Overcast' },
          ]}
          selected={sky}
          onSelect={s => setSky(s as SkyCondition)}
        />

        <Text style={styles.sectionLabel}>GROUND</Text>
        <ChipSelector
          options={[
            { id: 'asphalt',  label: '🛣️ Asphalt'  },
            { id: 'grass',    label: '🌿 Grass'    },
            { id: 'sand',     label: '🏖️ Sand'     },
            { id: 'concrete', label: '⬜ Concrete' },
          ]}
          selected={ground}
          onSelect={g => setGround(g as GroundType)}
        />

        <Text style={styles.sectionLabel}>CITY THEME</Text>
        <ChipSelector
          options={THEMES}
          selected={city.theme}
          onSelect={t => setTheme(t as CityTheme)}
        />
      </ScrollView>

      {/* Building picker modal */}
      <Modal
        visible={pickingSlot !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPickingSlot(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a Building</Text>
              <TouchableOpacity onPress={() => setPickingSlot(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {buildings.length === 0 ? (
              <Text style={styles.modalEmpty}>No buildings saved yet. Design some first!</Text>
            ) : (
              <FlatList
                data={buildings}
                keyExtractor={b => b.id}
                numColumns={3}
                contentContainerStyle={styles.pickerGrid}
                columnWrapperStyle={styles.pickerRow}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => handlePickBuilding(item.id)}
                  >
                    <BuildingRenderer building={item} scale={0.55} />
                    <Text style={styles.pickerName} numberOfLines={1}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.background },

  sky: {
    height: 260,
    overflow: 'hidden',
    position: 'relative',
  },
  skyTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '60%',
  },
  slotsRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 28,
    minWidth: '100%',
  },
  slot: {
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
  emptySlot: {
    width: 50,
    height: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotPlus: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.5)',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 24,
  },

  controls: { flex: 1 },
  controlsContent: { padding: 20 },

  hint: {
    color: UI.textMuted,
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionLabel: {
    color: UI.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: UI.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: UI.border,
  },
  modalTitle: { color: UI.text, fontSize: 17, fontWeight: '700' },
  modalClose: { color: UI.textMuted, fontSize: 20 },
  modalEmpty: { color: UI.textMuted, textAlign: 'center', padding: 40, fontSize: 14 },

  pickerGrid: { padding: 12 },
  pickerRow: { gap: 8 },
  pickerItem: {
    flex: 1,
    backgroundColor: UI.card,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: UI.border,
  },
  pickerName: {
    color: UI.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
