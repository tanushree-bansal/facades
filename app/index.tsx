import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { UI } from '../constants/colors';
import { useBuilding } from '../store/BuildingContext';

function SkylineDecor() {
  return (
    <Svg width="100%" height={140} viewBox="0 0 400 140" preserveAspectRatio="xMidYMax meet">
      {/* Sky gradient background */}
      <Rect width={400} height={140} fill="#0D1B2A" />

      {/* Moon */}
      <Circle cx={340} cy={30} r={18} fill="#F5E642" opacity={0.9} />
      <Circle cx={350} cy={24} r={14} fill="#0D1B2A" />

      {/* Stars */}
      {[[20,15],[60,8],[100,20],[160,5],[220,18],[280,10],[380,25]].map(([x,y],i)=>(
        <Circle key={i} cx={x} cy={y} r={1.5} fill="#FFFFFF" opacity={0.8} />
      ))}

      {/* Building silhouettes */}
      <Rect x={0}   y={70}  width={40}  height={70} fill="#1B2A4A" />
      <Rect x={30}  y={40}  width={55}  height={100} fill="#162238" />
      <Rect x={75}  y={60}  width={35}  height={80} fill="#1B2A4A" />
      <Rect x={100} y={20}  width={50}  height={120} fill="#0F3460" />
      <Rect x={140} y={50}  width={40}  height={90} fill="#162238" />
      <Rect x={170} y={30}  width={60}  height={110} fill="#1B2A4A" />
      <Rect x={220} y={55}  width={45}  height={85} fill="#0F3460" />
      <Rect x={255} y={35}  width={35}  height={105} fill="#162238" />
      <Rect x={280} y={65}  width={50}  height={75} fill="#1B2A4A" />
      <Rect x={320} y={45}  width={40}  height={95} fill="#0F3460" />
      <Rect x={355} y={70}  width={45}  height={70} fill="#162238" />

      {/* Antenna on tallest */}
      <Rect x={122} y={8} width={4} height={12} fill="#E94560" />
      <Rect x={192} y={18} width={4} height={12} fill="#E94560" />

      {/* Windows glow */}
      {[[38,55],[38,70],[55,45],[55,60],[110,30],[110,45],[110,60],[180,38],[180,55]].map(([x,y],i)=>(
        <Rect key={i} x={x} y={y} width={6} height={5} fill="#FFD700" opacity={0.6} />
      ))}

      {/* Ground */}
      <Rect x={0} y={135} width={400} height={5} fill="#E94560" opacity={0.4} />
    </Svg>
  );
}

interface MenuButtonProps {
  label: string;
  subtitle: string;
  emoji: string;
  onPress: () => void;
  accent?: boolean;
}

function MenuButton({ label, subtitle, emoji, onPress, accent }: MenuButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.menuBtn, accent && styles.menuBtnAccent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, accent && styles.menuLabelAccent]}>{label}</Text>
        <Text style={styles.menuSub}>{subtitle}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { newBuilding, buildings } = useBuilding();

  function handleDesign() {
    newBuilding();
    router.push('/design');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.skylineWrap}>
        <SkylineDecor />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>FACADES</Text>
        <Text style={styles.tagline}>Design your city, floor by floor</Text>
      </View>

      <View style={styles.menu}>
        <MenuButton
          emoji="🏗️"
          label="Design a Building"
          subtitle="Customize facade, windows & roof"
          onPress={handleDesign}
          accent
        />
        <MenuButton
          emoji="🏙️"
          label="City Skyline"
          subtitle="Arrange your buildings"
          onPress={() => router.push('/skyline')}
        />
        <MenuButton
          emoji="🗂️"
          label={`My Buildings${buildings.length ? ` (${buildings.length})` : ''}`}
          subtitle="Browse your saved designs"
          onPress={() => router.push('/collection')}
        />
      </View>

      <Text style={styles.version}>v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI.background,
  },
  skylineWrap: {
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: UI.text,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 14,
    color: UI.accent,
    marginTop: 4,
    letterSpacing: 1,
  },
  menu: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
  },
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: UI.border,
    gap: 14,
  },
  menuBtnAccent: {
    backgroundColor: UI.accent,
    borderColor: UI.accent,
  },
  menuEmoji: {
    fontSize: 28,
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: UI.text,
  },
  menuLabelAccent: {
    color: '#FFF',
  },
  menuSub: {
    fontSize: 12,
    color: UI.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: UI.textMuted,
  },
  version: {
    textAlign: 'center',
    color: UI.border,
    fontSize: 12,
    paddingBottom: 20,
  },
});
