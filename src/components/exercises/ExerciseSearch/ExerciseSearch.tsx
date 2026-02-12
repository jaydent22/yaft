"use client";
import { useState } from "react";
import FilterBottomSheet from "./FilterBottomSheet";
import { searchExercises } from "../../../lib/actions/exercises";
import ExerciseCard from "../ExerciseCard";
import type { Tables } from "../../../types/database";
import type { MuscleGroupWithMuscles } from "../../../lib/actions/filters";

export type ExerciseSearchResult = Tables<"exercises"> & {
  muscles: Pick<Tables<"muscles">, "id" | "name">;
  equipment: Pick<Tables<"equipment">, "id" | "name">;
};

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

  const runSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

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
    }
  };

  const clearFilters = () => {
    setSelectedMuscleId("");
    setSelectedGroupId("");
    setSelectedEquipment("");
  }

  return (
    <div className="py-2">
      <div className="sticky top-0 z-10 bg-background p-2 space-y-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            runSearch();
          }}
          placeholder="Search exercises..."
          className="w-full p-2 border border-gray-300 rounded-md w-full"
        />
        <FilterBottomSheet
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
        {results.map((exercise) => (
          <div key={exercise.id} className="mr-4">
            <ExerciseCard
              exercise={exercise}
              onClick={() => onSelectExercise(exercise)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseSearch;
