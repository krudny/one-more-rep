import { useColorScheme } from 'react-native';
import type { Colors } from './theme.types';

const PALETTE = {
  LIGHT: {
    BACKGROUND: '#F4F5F7',
    CARD: '#FFFFFF',
    TEXT: '#15171A',
    MUTED: '#6B7280',
    BORDER: '#E3E5E8',
    PRIMARY: '#FF5A1F',
    PRIMARY_TEXT: '#FFFFFF',
    SUCCESS: '#16A34A',
    DANGER: '#DC2626',
    CHIP: '#ECEDEF',
    TRANSPARENT: 'transparent',
  },
  DARK: {
    BACKGROUND: '#0E0F11',
    CARD: '#1A1C1F',
    TEXT: '#F3F4F6',
    MUTED: '#9CA3AF',
    BORDER: '#2A2D31',
    PRIMARY: '#FF6B33',
    PRIMARY_TEXT: '#FFFFFF',
    SUCCESS: '#22C55E',
    DANGER: '#EF4444',
    CHIP: '#26292D',
    TRANSPARENT: 'transparent',
  },
} as const;

export function useColors(): Colors {
  const colorScheme = useColorScheme();
  if (colorScheme === 'dark') {
    return PALETTE.DARK;
  }
  return PALETTE.LIGHT;
}

export const SPACING = {
  XXS: 2,
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 48,
} as const;

export const RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  PILL: 999,
} as const;
