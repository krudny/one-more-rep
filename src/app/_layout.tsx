import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { AppStoreProvider, useAppStore } from '@/state/AppStore';
import { RestTimerProvider } from '@/state/RestTimer';
import { useColors } from '@/theme';

function RootNavigator() {
  const { ready } = useAppStore();
  const c = useColors();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.card },
        headerTintColor: c.text,
        contentStyle: { backgroundColor: c.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ title: 'Workout' }} />
      <Stack.Screen name="pick-exercise" options={{ title: 'Add exercise', presentation: 'modal' }} />
      <Stack.Screen name="exercise/[id]" options={{ title: 'Exercise' }} />
      <Stack.Screen name="history/[id]" options={{ title: 'Workout details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStoreProvider>
        <RestTimerProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </RestTimerProvider>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
