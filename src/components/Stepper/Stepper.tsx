import type { ReactElement } from 'react';
import { Pressable, Text, TextInput, View, type PressableStateCallbackType } from 'react-native';
import { useStepper } from '@/hooks/useStepper/useStepper';
import { useColors } from '@/theme';
import { DEFAULT_DECIMALS, DEFAULT_MIN, DEFAULT_STEP } from './Stepper.constants';
import { createStepperStyles, getStepperButtonOpacityStyle } from './Stepper.styles';
import type { StepperProps } from './Stepper.types';

export function Stepper({
  label,
  value,
  onChange,
  step = DEFAULT_STEP,
  min = DEFAULT_MIN,
  decimals = DEFAULT_DECIMALS,
  large = false,
}: StepperProps): ReactElement {
  const colors = useColors();
  const styles = createStepperStyles(colors, large);
  const { text, handleFocus, handleBlur, handleChangeText, handleIncrement, handleDecrement } =
    useStepper({ value, min, decimals, step, onChange });

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={`Decrease ${label}`}
          onPress={handleDecrement}
          style={({ pressed }: PressableStateCallbackType) => [
            styles.button,
            styles.decrementButton,
            getStepperButtonOpacityStyle(pressed),
          ]}
        >
          <Text style={[styles.buttonText, styles.decrementText]}>−</Text>
        </Pressable>
        <TextInput
          value={text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          keyboardType="decimal-pad"
          selectTextOnFocus
          style={styles.input}
        />
        <Pressable
          accessibilityLabel={`Increase ${label}`}
          onPress={handleIncrement}
          style={({ pressed }: PressableStateCallbackType) => [
            styles.button,
            styles.incrementButton,
            getStepperButtonOpacityStyle(pressed),
          ]}
        >
          <Text style={[styles.buttonText, styles.incrementText]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
