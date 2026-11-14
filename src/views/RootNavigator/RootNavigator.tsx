import { Stack } from 'expo-router';
import type { ReactElement } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRoutinesStore } from '@/state/RoutinesStore/RoutinesStore';
import { useColors } from '@/theme';
import { createRootNavigatorStyles, getStackScreenOptions } from './RootNavigator.styles';

export function RootNavigator(): ReactElement {
  const { ready: appReady } = useAppStore();
  const { ready: routinesReady } = useRoutinesStore();
  const colors = useColors();
  const styles = createRootNavigatorStyles(colors);

  if (!appReady || !routinesReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <Stack screenOptions={getStackScreenOptions(colors)}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ title: 'Workout' }} />
      <Stack.Screen
        name="pick-exercise"
        options={{ title: 'Add exercise', presentation: 'modal' }}
      />
      <Stack.Screen name="exercise/[id]" options={{ title: 'Exercise' }} />
      <Stack.Screen name="history/[id]" options={{ title: 'Workout details' }} />
    </Stack>
  );
}
