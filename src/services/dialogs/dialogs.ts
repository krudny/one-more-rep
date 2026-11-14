import { Alert, Platform } from 'react-native';
import type { ConfirmActionOptions } from './dialogs.types';

export function showAlert(title: string, message: string): void {
  if (Platform.OS === 'web') {
    if (typeof globalThis.alert === 'function') {
      globalThis.alert(`${title}\n\n${message}`);
      return;
    }
  }
  Alert.alert(title, message);
}

export function confirmAction(options: ConfirmActionOptions): void {
  const { title, message, confirmText, isDestructive, onConfirm } = options;

  if (Platform.OS === 'web') {
    if (typeof globalThis.confirm === 'function') {
      if (globalThis.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
      return;
    }
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: confirmText,
      style: isDestructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}
