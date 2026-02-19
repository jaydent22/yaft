"use client";
import { useState } from "react";
import StartWorkoutModal from "./StartWorkoutModal";
import type { Tables } from "../../types/database";

const WorkoutClient = ({ existingWorkout }: { existingWorkout?: Tables<"workout_sessions"> | null }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-accent mb-4">Workout</h1>
        <button
          role="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-accent text-foreground rounded-full hover:bg-accent-hover active:bg-accent-active"
        >
          Start Workout
        </button>
        <StartWorkoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
};

export default WorkoutClient;