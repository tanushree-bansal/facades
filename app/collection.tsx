import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BuildingRenderer from '../components/building/BuildingRenderer';
import { useBuilding } from '../store/BuildingContext';
import { UI } from '../constants/colors';
import type { Building } from '../types/building';

function BuildingCard({ building, onEdit, onDelete }: {
  building: Building;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.preview} onPress={onEdit}>
        <BuildingRenderer building={building} scale={0.85} />
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.buildingName}>{building.name}</Text>
        <Text style={styles.buildingMeta}>
          {building.floors.length} floors · {building.category} · {building.material}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CollectionScreen() {
  const router = useRouter();
  const { buildings, loadBuilding, deleteBuilding, newBuilding } = useBuilding();

  function handleEdit(id: string) {
    loadBuilding(id);
    router.push('/design');
  }

  function handleDelete(id: string, name: string) {
    Alert.alert('Delete Building', `Remove "${name}" from your collection?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteBuilding(id) },
    ]);
  }

  function handleNew() {
    newBuilding();
    router.push('/design');
  }

  if (buildings.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🏗️</Text>
        <Text style={styles.emptyTitle}>No Buildings Yet</Text>
        <Text style={styles.emptyText}>Design your first building and save it here.</Text>
        <TouchableOpacity style={styles.newBtn} onPress={handleNew}>
          <Text style={styles.newBtnText}>Start Designing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={buildings}
        keyExtractor={b => b.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <BuildingCard
            building={item}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={handleNew}>
        <Text style={styles.fabText}>+ New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.background },

  list: { padding: 12, paddingBottom: 80 },
  row: { gap: 12 },

  card: {
    flex: 1,
    backgroundColor: UI.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: UI.border,
    marginBottom: 12,
  },
  preview: {
    backgroundColor: UI.surface,
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 120,
    justifyContent: 'flex-end',
  },
  cardInfo: { padding: 10 },
  buildingName: { color: UI.text, fontSize: 14, fontWeight: '700' },
  buildingMeta: { color: UI.textMuted, fontSize: 11, marginTop: 2 },

  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: UI.border },
  actionBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderRightWidth: 1, borderRightColor: UI.border,
  },
  deleteBtn: { borderRightWidth: 0 },
  actionBtnText: { color: UI.textMuted, fontSize: 13, fontWeight: '600' },

  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: UI.background, padding: 40,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: UI.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: UI.textMuted, textAlign: 'center', marginBottom: 28 },
  newBtn: {
    backgroundColor: UI.accent, borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  newBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    backgroundColor: UI.accent, borderRadius: 24,
    paddingHorizontal: 22, paddingVertical: 13,
    elevation: 4, shadowColor: UI.accent,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
