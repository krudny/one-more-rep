import { Stack } from 'expo-router';
import type { ReactElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { IconButton } from '@/components/IconButton/IconButton';
import { RoutineExerciseRow } from '@/components/RoutineExerciseRow/RoutineExerciseRow';
import { useRoutineEditor } from '@/hooks/useRoutineEditor/useRoutineEditor';
import type { RoutineExercise } from '@/lib/types';
import { useColors } from '@/theme';
import { KEYBOARD_VERTICAL_OFFSET_IOS } from './RoutineEditorScreenView.constants';
import { createRoutineEditorScreenViewStyles } from './RoutineEditorScreenView.styles';
import type { RoutineEditorScreenViewProps } from './RoutineEditorScreenView.types';

export function RoutineEditorScreenView({ routineId }: RoutineEditorScreenViewProps): ReactElement {
  const colors = useColors();
  const styles = createRoutineEditorScreenViewStyles(colors);
  const {
    draft,
    isEditMode,
    notFound,
    validationMessage,
    handleChangeName,
    handleAddExercise,
    handleSetCountChange,
    handleMoveUp,
    handleMoveDown,
    handleRemoveExercise,
    handleSaveRoutine,
    handleSaveAndStart,
    handleDeleteRoutine,
    handleBack,
  } = useRoutineEditor(routineId);

  if (notFound) {
    return <EmptyState icon="alert-circle-outline" title="Routine not found" />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_IOS}
    >
      <Stack.Screen
        options={{
          title: isEditMode ? 'Edit routine' : 'New routine',
          headerBackVisible: false,
          headerLeft: (): ReactElement => (
            <IconButton
              icon="arrow-back"
              label="Back"
              color={colors.TEXT}
              style={styles.headerLeftButton}
              onPress={handleBack}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card style={styles.nameCard}>
          <Text style={styles.fieldLabel}>Routine name</Text>
          <TextInput
            value={draft.name}
            onChangeText={handleChangeName}
            style={styles.nameInput}
            placeholder="New routine"
            placeholderTextColor={colors.MUTED}
          />
        </Card>

        {validationMessage !== null && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{validationMessage}</Text>
          </View>
        )}

        {draft.exercises.length === 0 ? (
          <EmptyState
            icon="barbell-outline"
            title="No exercises in routine"
            subtitle="Add at least one exercise and choose how many sets you plan to do."
          />
        ) : (
          draft.exercises.map((routineExercise: RoutineExercise, index: number) => (
            <RoutineExerciseRow
              key={routineExercise.id}
              entry={routineExercise}
              isFirst={index === 0}
              isLast={index === draft.exercises.length - 1}
              onSetCountChange={(setCount: number): void =>
                handleSetCountChange(routineExercise.id, setCount)
              }
              onMoveUp={(): void => handleMoveUp(routineExercise.id)}
              onMoveDown={(): void => handleMoveDown(routineExercise.id)}
              onRemove={(): void => handleRemoveExercise(routineExercise.id)}
            />
          ))
        )}

        <Button
          title="Add exercise"
          icon="add"
          variant={ButtonVariants.SECONDARY}
          onPress={handleAddExercise}
        />

        <View style={styles.bottomButtons}>
          <Button title="Save routine" icon="checkmark" onPress={handleSaveRoutine} />
          <Button
            title="Save and start"
            icon="play"
            variant={ButtonVariants.SECONDARY}
            onPress={handleSaveAndStart}
          />
          {isEditMode && (
            <Button
              title="Delete routine"
              icon="trash-outline"
              variant={ButtonVariants.DANGER}
              onPress={handleDeleteRoutine}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
