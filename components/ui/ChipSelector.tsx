import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { UI } from '../../constants/colors';

interface Option {
  id: string;
  label: string;
  icon?: string;
}

interface Props {
  options: Option[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function ChipSelector({ options, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={[styles.chip, selected === opt.id && styles.chipActive]}
          >
            {opt.icon && <Text style={styles.icon}>{opt.icon}</Text>}
            <Text style={[styles.label, selected === opt.id && styles.labelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: UI.surface,
    borderWidth: 1,
    borderColor: UI.border,
  },
  chipActive: {
    backgroundColor: UI.accent,
    borderColor: UI.accent,
  },
  icon: {
    fontSize: 13,
    color: UI.text,
  },
  label: {
    fontSize: 13,
    color: UI.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFF',
    fontWeight: '700',
  },
});
