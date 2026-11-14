import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import type { UseStepperParams, UseStepperResult } from './useStepper.types';

export function useStepper({
  value,
  min,
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

  const applyValue = (rawValue: number): void => {
    const nextValue = Math.max(min, Number(rawValue.toFixed(decimals)));
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
      onChange(Math.max(min, parsedNumber));
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
