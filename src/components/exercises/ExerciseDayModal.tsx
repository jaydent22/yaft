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

  function handleDeleteExercise(exerciseId: string) {
    setExercises((prevExercises) =>
      prevExercises.filter((ex) => ex.exerciseId !== exerciseId)
    );
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
              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <p className="text-foreground">{exercise.name}</p>
                  {/* <button
                    type="button"
                    onClick={() => handleDeleteExercise(exercise.exerciseId)}
                    className="text-foreground-muted hover:text-foreground rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
                  >
                    &times;
                  </button> */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExercise(exercise.exerciseId);
                    }}
                    className="inline-flex self-start hover:bg-red-500 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1 text-foreground">
                  <p>Sets: </p>
                  <input
                    type="number"
                    min={1}
                    className="w-16 px-2 py-1 border border-border rounded-md focus:outline-none focus:border-accent"
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
                  <p>Reps: </p>
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
              </div>
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
