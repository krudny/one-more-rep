import { Stack, router } from 'expo-router';
import type { ReactElement } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { IconButton } from '@/components/IconButton/IconButton';
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
    <Stack
      screenOptions={{
        ...getStackScreenOptions(colors),
        headerLeft: ({ canGoBack }): ReactElement | null =>
          canGoBack ? (
            <IconButton
              icon="arrow-back"
              label="Back"
              color={colors.TEXT}
              style={styles.headerLeftButton}
              onPress={(): void => router.back()}
            />
          ) : null,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ title: 'Workout' }} />
      <Stack.Screen name="routine-editor" options={{ title: 'Routine' }} />
      <Stack.Screen
        name="pick-exercise"
        options={{ title: 'Add exercise', presentation: 'modal' }}
      />
      <Stack.Screen name="exercise/[id]" options={{ title: 'Exercise' }} />
      <Stack.Screen name="history/[id]" options={{ title: 'Workout details' }} />
    </Stack>
  );
}
