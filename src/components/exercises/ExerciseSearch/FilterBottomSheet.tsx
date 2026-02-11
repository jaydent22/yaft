import { useState } from "react";
import BottomSheet from "../../BottomSheet";

const FilterBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>test</p>
        <div className="mt-4 mb-4 text-center">
          <div className="flex justify-center items-center space-x-4">
            <button type="button" className="px-2 py-1 rounded-md bg-surface active:bg-surface-active border border-border" onClick={() => setIsOpen(false)}>
              Close
            </button>
            {/* TODO - implement filter logic */}
            <button type="button" className="px-2 py-1 rounded-md bg-accent active:bg-accent-active border border-border" onClick={() => alert("Apply filters")}>
              Apply
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default FilterBottomSheet;
