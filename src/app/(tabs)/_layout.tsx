import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ReactElement } from 'react';
import type { IconName } from '@/components/Button/Button.types';
import { useColors } from '@/theme';
import { getTabsScreenOptions } from '@/views/RootNavigator/RootNavigator.styles';
import type { TabIconProps } from '@/views/RootNavigator/RootNavigator.types';

function renderTabIcon(name: IconName): (props: TabIconProps) => ReactElement {
  return function TabIcon({ color, size }: TabIconProps): ReactElement {
    return <Ionicons name={name} color={String(color)} size={size} />;
  };
}

export default function TabsLayout(): ReactElement {
  const colors = useColors();
  return (
    <Tabs screenOptions={getTabsScreenOptions(colors)}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Workout', tabBarIcon: renderTabIcon('barbell') }}
      />
      <Tabs.Screen
        name="exercises"
        options={{ title: 'Exercises', tabBarIcon: renderTabIcon('list') }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History', tabBarIcon: renderTabIcon('time') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: renderTabIcon('person') }}
      />
    </Tabs>
  );
}
