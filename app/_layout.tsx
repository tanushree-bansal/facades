import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { BuildingProvider } from '../store/BuildingContext';
import { CityProvider } from '../store/CityContext';
import { UI } from '../constants/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <BuildingProvider>
        <CityProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: UI.surface },
              headerTintColor: UI.text,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: UI.background },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="design" options={{ title: 'Design Building' }} />
            <Stack.Screen name="skyline" options={{ title: 'City Skyline' }} />
            <Stack.Screen name="collection" options={{ title: 'My Buildings' }} />
          </Stack>
        </CityProvider>
      </BuildingProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
