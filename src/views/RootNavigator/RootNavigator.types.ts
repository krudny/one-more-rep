import type { Stack } from 'expo-router';
import type { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue, ViewStyle } from 'react-native';

export type RootNavigatorStyles = {
  loadingContainer: ViewStyle;
};

export type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];
export type TabsScreenOptions = ComponentProps<typeof Tabs>['screenOptions'];

export type TabIconProps = {
  color: ColorValue;
  size: number;
};
