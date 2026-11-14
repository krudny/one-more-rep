import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import type { UseStepperParams, UseStepperResult } from './useStepper.types';

export function useStepper({
  value,
  min,
  max,
  decimals,
  step,
  onChange,
}: UseStepperParams): UseStepperResult {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(String(value));
    }
  }, [value, focused]);

  const clampValue = (rawValue: number): number => {
    const withMin = Math.max(min, rawValue);
    return max !== undefined ? Math.min(max, withMin) : withMin;
  };

  const applyValue = (rawValue: number): void => {
    const nextValue = clampValue(Number(rawValue.toFixed(decimals)));
    if (nextValue === value) {
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    onChange(nextValue);
    setText(String(nextValue));
  };

  const handleFocus = (): void => setFocused(true);
  const handleBlur = (): void => setFocused(false);

  const handleChangeText = (inputText: string): void => {
    setText(inputText);
    const parsedNumber = Number(inputText.replace(',', '.'));
    if (inputText.trim() !== '' && !Number.isNaN(parsedNumber)) {
      onChange(clampValue(parsedNumber));
    }
  };

  const handleIncrement = (): void => applyValue(value + step);
  const handleDecrement = (): void => applyValue(value - step);

  return {
    text,
    handleFocus,
    handleBlur,
    handleChangeText,
    handleIncrement,
    handleDecrement,
  };
}
