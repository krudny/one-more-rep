import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactElement } from 'react';
import { AppStoreProvider } from '@/state/AppStore/AppStore';
import { RestTimerProvider } from '@/state/RestTimer/RestTimer';
import { RoutineDraftProvider } from '@/state/RoutineDraft/RoutineDraft';
import { RoutinesStoreProvider } from '@/state/RoutinesStore/RoutinesStore';
import { useIsDarkMode } from '@/theme';
import { RootNavigator } from '@/views/RootNavigator/RootNavigator';

export default function RootLayout(): ReactElement {
  const isDarkMode = useIsDarkMode();
  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <AppStoreProvider>
        <RoutinesStoreProvider>
          <RoutineDraftProvider>
            <RestTimerProvider>
              <StatusBar style={isDarkMode ? 'light' : 'dark'} />
              <RootNavigator />
            </RestTimerProvider>
          </RoutineDraftProvider>
        </RoutinesStoreProvider>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
