import * as Haptics from 'expo-haptics';
import { flags } from '@/lib/features/features';

export function playSelectionHaptic(): void {
  if (!flags.haptics) {
    return;
  }
  Haptics.selectionAsync().catch(() => {});
}

export function playSuccessHaptic(): void {
  if (!flags.haptics) {
    return;
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
