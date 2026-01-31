"use client";

import { useState } from "react";
import type { ExerciseDay } from "../programs/ProgramEditor";
import ExerciseDayModal from "./ExerciseDayModal";

const ExerciseDayCard = ({
  day,
  onUpdate,
  onDelete,
}: {
  day: ExerciseDay;
  onUpdate: (updatedDay: ExerciseDay) => void;
  onDelete: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setIsModalOpen(true)}
      className="border border-border rounded-lg p-2 md:p-4 bg-surface hover:bg-surface-hover cursor-pointer max-w-xs flex flex-col space-y-2"
    >
        <div className="flex justify-between items-start gap-4 pb-2 border-b border-border">
      <p >{day.name}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="inline-flex self-start hover:bg-red-500 rounded-md "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
      </div>
      {(day.exercises.length === 0) ? (
        <p className="text-foreground-muted text-sm italic">No exercises added</p>
      ) :
        day.exercises.map((exercise, index) => (
          <p key={index} className="text-foreground">
            {exercise.name}: {exercise.sets} &times; {exercise.reps}
          </p>
        )
      )}
      <ExerciseDayModal
        day={day}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedDay) => {
        onUpdate(updatedDay);
        setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExerciseDayCard;
