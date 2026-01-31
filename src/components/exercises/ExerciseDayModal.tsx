import { useState } from "react";

import Modal from "../Modal";
import FloatingInput from "../FloatingInput";
import type { ExerciseDay } from "../programs/ProgramEditor";

const ExerciseDayModal = ({
  day,
  isOpen,
  onClose,
}: {
  day: ExerciseDay;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [dayName, setDayName] = useState(day.name ?? "");
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <FloatingInput
          id="exercise-day-name"
          label="Exercise Day Name"
          value={dayName ?? ""}
          className="max-w-md"
          onChange={(e) => setDayName(e.target.value)}
          required
        />
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover active:bg-accent-active"
          onClick={() => {
            // Here you would typically handle saving the updated day name
            // For example, calling a prop function passed down to update the day
            onClose();
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default ExerciseDayModal;
