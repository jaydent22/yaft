"use client";
import { useState } from "react";
import FilterBottomSheet from "./FilterBottomSheet";
import { searchExercises } from "../../../lib/actions/exercises";
import ExerciseCard from "../ExerciseCard";
import type { Tables } from "../../../types/database";
import type { MuscleGroupWithMuscles } from "../../../lib/actions/filters";

export type ExerciseSearchResult = {
  id: string;
  name: string;
  description?: string;
  equipmentId?: string;
  muscleGroupId?: string;
}

const ExerciseSearch = ({
  onSelectExercise,
  muscleGroups,
  equipment,
}: {
  onSelectExercise: (exercise: ExerciseSearchResult) => void;
  muscleGroups: MuscleGroupWithMuscles[];
  equipment: Tables<"equipment">[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ExerciseSearchResult[]>([]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setResults([]);
      return;
    }
    try {
      const data = await searchExercises(term);
      setResults(data || []);
    } catch (error) {
      console.error("Error searching exercises:", error);
      setResults([]);
    }
  };

  return (
    <div className="py-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search exercises..."
        className="w-full p-2 border border-gray-300 rounded-md w-full"
      />
      <FilterBottomSheet muscleGroups={muscleGroups} equipment={equipment} />
      <div className="flex flex-wrap overflow-y-auto p-2 md:p-4 mt-4 gap-2 min-h-30">
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
