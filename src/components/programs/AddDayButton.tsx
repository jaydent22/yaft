import AnchoredMenu from "../AnchoredMenu";

const AddDayButton = ({
  index,
  onAddDay,
}: {
  index: number;
  onAddDay: (type: "exercise" | "rest", index: number) => void;
}) => {
  return (
    <AnchoredMenu button={<div>+</div>}>
      {({ closeMenu }) => (
        <div className="flex flex-col p-4 space-y-2">
          <button
            type="button"
            className="px-2 py-1 rounded-md text-left hover:bg-surface-hover active:bg-surface-active"
            onClick={() => {
              onAddDay("exercise", index);
              closeMenu();
            }}
          >
            Exercise Day
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-md text-left hover:bg-surface-hover active:bg-surface-active"
            onClick={() => {
              onAddDay("rest", index);
              closeMenu();
            }}
          >
            Rest Day
          </button>
        </div>
      )}
    </AnchoredMenu>
  );
};

export default AddDayButton;