import type { Exercise } from "../programs/ProgramEditor";

const ExerciseCard = ({
  exercise,
  onClick,
}: {
  exercise: Exercise;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 border border-border rounded-md bg-surface hover:bg-surface-hover active:bg-surface-active text-left"
    >
      <p className="text-xs">{exercise.name}</p>
    </button>
  );
};

export default ExerciseCard;
