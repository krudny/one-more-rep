import { StyleSheet } from 'react-native';
import type { Colors } from '@/theme/theme.types';
import type {
  RootNavigatorStyles,
  StackScreenOptions,
  TabsScreenOptions,
} from './RootNavigator.types';

export function createRootNavigatorStyles(colors: Colors): RootNavigatorStyles {
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.BACKGROUND,
    },
  });
}

export function getStackScreenOptions(colors: Colors): StackScreenOptions {
  return {
    headerStyle: { backgroundColor: colors.CARD },
    headerTintColor: colors.TEXT,
    contentStyle: { backgroundColor: colors.BACKGROUND },
  };
}

export function getTabsScreenOptions(colors: Colors): TabsScreenOptions {
  return {
    tabBarActiveTintColor: colors.PRIMARY,
    tabBarInactiveTintColor: colors.MUTED,
    tabBarStyle: { backgroundColor: colors.CARD, borderTopColor: colors.BORDER },
    headerStyle: { backgroundColor: colors.CARD },
    headerTintColor: colors.TEXT,
    sceneStyle: { backgroundColor: colors.BACKGROUND },
  };
}
