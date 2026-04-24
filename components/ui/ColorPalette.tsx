import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { UI } from '../../constants/colors';

interface Props {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
  size?: number;
}

export default function ColorPalette({ colors, selected, onSelect, size = 32 }: Props) {
  return (
    <View style={styles.row}>
      {colors.map(color => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelect(color)}
          style={[
            styles.swatch,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
            selected === color && styles.selected,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: UI.accent,
    transform: [{ scale: 1.15 }],
  },
});
