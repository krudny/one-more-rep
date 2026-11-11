import { useColorScheme } from 'react-native';

const palette = {
  light: {
    background: '#F4F5F7',
    card: '#FFFFFF',
    text: '#15171A',
    muted: '#6B7280',
    border: '#E3E5E8',
    primary: '#FF5A1F',
    primaryText: '#FFFFFF',
    success: '#16A34A',
    danger: '#DC2626',
    chip: '#ECEDEF',
  },
  dark: {
    background: '#0E0F11',
    card: '#1A1C1F',
    text: '#F3F4F6',
    muted: '#9CA3AF',
    border: '#2A2D31',
    primary: '#FF6B33',
    primaryText: '#FFFFFF',
    success: '#22C55E',
    danger: '#EF4444',
    chip: '#26292D',
  },
};

export type Colors = typeof palette.light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? palette.dark : palette.light;
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
