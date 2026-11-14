import type { ViewStyle } from 'react-native';
import { ICON_BUTTON_OPACITY } from './IconButton.constants';

export function getIconButtonStyle(pressed: boolean): ViewStyle {
  return {
    opacity: pressed ? ICON_BUTTON_OPACITY.PRESSED : ICON_BUTTON_OPACITY.ENABLED,
  };
}
