import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
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
    headerLeftButton: {
      marginLeft: SPACING.LG,
      marginRight: SPACING.SM,
    },
  });
}

export function getStackScreenOptions(colors: Colors): StackScreenOptions {
  return {
    headerStyle: { backgroundColor: colors.CARD },
    headerTintColor: colors.TEXT,
    headerTitleStyle: { fontWeight: '700' },
    headerBackVisible: false,
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
    headerTitleStyle: { fontWeight: '700' },
    headerTitleContainerStyle: { marginHorizontal: SPACING.LG },
    sceneStyle: { backgroundColor: colors.BACKGROUND },
  };
}
