"use client";
import { useState } from "react";
import type { Exercise } from "../programs/ProgramEditor";
import { searchExercises } from "./actions";
import ExerciseCard from "./ExerciseCard";

const ExerciseSearch = ({
  onSelectExercise,
}: {
  onSelectExercise: (exercise: Exercise) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Exercise[]>([]);

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
    <div className="p-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search exercises..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
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
