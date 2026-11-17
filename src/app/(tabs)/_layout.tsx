import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ReactElement } from 'react';
import type { IconName } from '@/components/Button/Button.types';
import { flags } from '@/lib/features/features';
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
        options={{
          title: flags.workout ? 'Workout' : 'Home',
          tabBarIcon: renderTabIcon(flags.workout ? 'barbell' : 'home'),
        }}
      />
      <Tabs.Protected guard={flags.exercises}>
        <Tabs.Screen
          name="exercises"
          options={{ title: 'Exercises', tabBarIcon: renderTabIcon('list') }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard={flags.history}>
        <Tabs.Screen
          name="history"
          options={{ title: 'History', tabBarIcon: renderTabIcon('time') }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard={flags.profile}>
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarIcon: renderTabIcon('person') }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
