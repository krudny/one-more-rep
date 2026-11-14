import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactElement } from 'react';
import { useColorScheme } from 'react-native';
import { AppStoreProvider } from '@/state/AppStore/AppStore';
import { RestTimerProvider } from '@/state/RestTimer/RestTimer';
import { RootNavigator } from '@/views/RootNavigator/RootNavigator';

export default function RootLayout(): ReactElement {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStoreProvider>
        <RestTimerProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </RestTimerProvider>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
