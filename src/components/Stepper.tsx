import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { radius, useColors } from '@/theme';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  decimals?: number;
  /** Large variant is used for the rep counter. */
  large?: boolean;
};

/** Number input with big +/- buttons, used for reps and weight. */
export function Stepper({ label, value, onChange, step = 1, min = 0, decimals = 0, large }: Props) {
  const c = useColors();
  const size = large ? 56 : 40;
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  // Keep the text in sync with external changes, but don't fight the user while typing.
  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  const set = (v: number) => {
    const next = Math.max(min, Number(v.toFixed(decimals)));
    if (next !== value) {
      Haptics.selectionAsync().catch(() => {});
      onChange(next);
      setText(String(next));
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={`Decrease ${label}`}
          onPress={() => set(value - step)}
          style={({ pressed }) => [styles.btn, { width: size, height: size, backgroundColor: c.chip, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.btnText, { color: c.text, fontSize: large ? 30 : 22 }]}>−</Text>
        </Pressable>
        <TextInput
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={(t) => {
            setText(t);
            const n = Number(t.replace(',', '.'));
            if (t.trim() !== '' && !Number.isNaN(n)) onChange(Math.max(min, n));
          }}
          keyboardType="decimal-pad"
          selectTextOnFocus
          style={[styles.input, { color: c.text, fontSize: large ? 34 : 20, width: large ? 96 : 80 }]}
        />
        <Pressable
          accessibilityLabel={`Increase ${label}`}
          onPress={() => set(value + step)}
          style={({ pressed }) => [styles.btn, { width: size, height: size, backgroundColor: c.primary, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.btnText, { color: c.primaryText, fontSize: large ? 30 : 22 }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '700' },
  input: { textAlign: 'center', fontWeight: '800', fontVariant: ['tabular-nums'], paddingVertical: 0 },
});
