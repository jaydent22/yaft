import { useState } from "react";

import Modal from "../Modal";
import FloatingInput from "../FloatingInput";
import type { ExerciseDay } from "../programs/ProgramEditor";
import type { ExerciseSearchResult } from "./ExerciseSearch/ExerciseSearch";
import ExerciseSearch from "./ExerciseSearch/ExerciseSearch";
import type { Tables } from "../../types/database";
import type { MuscleGroupWithMuscles } from "../../lib/actions/filters";

const ExerciseDayModal = ({
  day,
  isOpen,
  onClose,
  onSave,
  muscleGroups,
  equipment,
}: {
  day: ExerciseDay;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDay: ExerciseDay) => void;
  muscleGroups: MuscleGroupWithMuscles[];
  equipment: Tables<"equipment">[];
}) => {
  const [dayName, setDayName] = useState(day.name ?? "");
  const [exercises, setExercises] = useState(day.exercises ?? []);

  function resetAndClose() {
    setDayName(day.name ?? "");
    setExercises(day.exercises ?? []);
    onClose();
  }

  function handleSave() {
    onSave({
      ...day,
      name: dayName,
      exercises: exercises.map((ex, i) => ({
        ...ex,
        sortOrder: i,
      })),
    });
    onClose();
  }

  function handleSelectExercise(exercise: ExerciseSearchResult) {
    setExercises((prevExercises) => {
      if (prevExercises.some((ex) => ex.exerciseId === exercise.id))
        return prevExercises; // Exercise already added

      return [
        ...prevExercises,
        {
          clientId: crypto.randomUUID(),
          exerciseId: exercise.id,
          name: exercise.name,
          sets: 3, // default sets
          reps: 10, // default reps
          sortOrder: prevExercises.length,
        },
      ];
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose}>
      <div className="flex flex-col h-full min-h-0">
        <FloatingInput
          id="exercise-day-name"
          label="Exercise Day Name"
          value={dayName ?? ""}
          className="max-w-md"
          onChange={(e) => setDayName(e.target.value)}
          required
        />

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-4 pr-1">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.exerciseId}
              className="flex items-center gap-3 text-sm md:text-base"
            >
              <span className="flex-1 text-foreground">{exercise.name}: </span>
              <input
                type="number"
                min={1}
                className="w-16 px-2 py-1 border border-border rounded-md text-foreground focus:outline-none focus:border-accent"
                value={exercise.sets}
                onChange={(e) =>
                  setExercises((prevExercises) =>
                    prevExercises.map((ex, i) =>
                      i === index
                        ? { ...ex, sets: parseInt(e.target.value, 10) }
                        : ex
                    )
                  )
                }
              />
              <span className="flex-1 text-foreground"> &times; </span>
              <input
                type="number"
                min={1}
                className="w-16 px-2 py-1 border border-border rounded-md text-foreground focus:outline-none focus:border-accent"
                value={exercise.reps}
                onChange={(e) =>
                  setExercises((prevExercises) =>
                    prevExercises.map((ex) =>
                      ex.exerciseId === exercise.exerciseId
                        ? { ...ex, reps: parseInt(e.target.value, 10) }
                        : ex
                    )
                  )
                }
              />
            </div>
          ))}
            <ExerciseSearch
              onSelectExercise={(exercise) => handleSelectExercise(exercise)}
              muscleGroups={muscleGroups}
              equipment={equipment}
            />
        </div>

        <div className="sticky bottom-0 bg-background pt-3 mt-4 border-t border-border">
          <button
            type="button"
            className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover active:bg-accent-active"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExerciseDayModal;
