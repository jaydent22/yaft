"use client";
import { useState, useEffect } from "react";
import FilterBottomSheet from "./FilterBottomSheet";
import { searchExercises } from "../../../lib/actions/exercises";
import ExerciseCard from "../ExerciseCard";
import type { Tables } from "../../../types/database";
import type { MuscleGroupWithMuscles } from "../../../lib/actions/filters";

export type ExerciseSearchResult = Tables<"exercise_search_view">;

const ExerciseSearch = ({
  onSelectExercise,
  muscleGroups,
  equipment,
  className,
}: {
  onSelectExercise: (exercise: ExerciseSearchResult) => void;
  muscleGroups: MuscleGroupWithMuscles[];
  equipment: Tables<"equipment">[];
  className?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ExerciseSearchResult[]>([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      runSearch();
    }, 250); // debounce search by 250ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedMuscleId, selectedGroupId, selectedEquipment]);

  const runSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const data = await searchExercises({
        query: searchTerm,
        muscleId: selectedMuscleId,
        groupId: selectedGroupId,
        equipmentId: selectedEquipment,
      });
      setResults(data || []);
    } catch (error) {
      console.error("Error searching exercises:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedMuscleId("");
    setSelectedGroupId("");
    setSelectedEquipment("");
  };

  return (
    <div className="py-2">
      <div className="sticky top-0 z-10 bg-background space-y-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search exercises..."
          className="w-full p-2 border border-gray-300 rounded-md w-full"
        />

        <div className="flex space-x-2 items-center">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 border border-border rounded-full background-surface text-foreground active:bg-surface-active"
          >
            <div className="flex space-x-2 items-center">
              <p>Filter</p>
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
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </div>
          </button>

          {selectedGroupId && (
            <div className="flex items-center space-x-1 px-2 py-1 border border-border rounded-full text-sm background-surface">
              <p>{`Muscle: ${
                muscleGroups.find((g) => g.id === selectedGroupId)?.name
              } | ${
                selectedMuscleId
                  ? `Muscle: ${
                      muscleGroups
                        .find((g) => g.id === selectedGroupId)
                        ?.muscles.find((m) => m.id === selectedMuscleId)?.name
                    }`
                  : "All"
              }`}</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedGroupId("");
                  setSelectedMuscleId("");
                }}
                className="text-foreground-muted hover:text-foreground rounded-md"
              >
                &times;
              </button>
            </div>
          )}
          {selectedEquipment && (
            <div className="flex items-center space-x-1 px-2 py-1 border border-border rounded-full text-sm background-surface">
              <p>{`Equipment: ${
                equipment.find((e) => e.id === selectedEquipment)?.name
              }`}</p>
              <button
                type="button"
                onClick={() => setSelectedEquipment("")}
                className="text-foreground-muted hover:text-foreground rounded-md"
              >
                &times;
              </button>
            </div>
          )}
        </div>
        <FilterBottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          muscleGroups={muscleGroups}
          equipment={equipment}
          selectedMuscleId={selectedMuscleId}
          setSelectedMuscleId={setSelectedMuscleId}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
          selectedEquipment={selectedEquipment}
          setSelectedEquipment={setSelectedEquipment}
          onApply={runSearch}
          onClear={clearFilters}
        />
      </div>
      <div
        className={`flex flex-wrap py-2 md:p-4 mt-4 gap-2 ${className ?? ""}`}
      >
        {loading ? (
          <p className="text-sm text-foreground-muted">Loading...</p>
        ) : (
          results.map((exercise) => (
            <div key={exercise.id} className="mr-4">
              <ExerciseCard
                exercise={exercise}
                onClick={() => onSelectExercise(exercise)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseSearch;
