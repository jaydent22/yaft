import { useState, useRef, useEffect } from "react";

type AnchoredMenuProps = {
  button: React.ReactNode;
  children: (props: { closeMenu: () => void }) => React.ReactNode;
  align?: "left" | "right";
};

const AnchoredMenu = ({
  button,
  children,
  align = "left",
}: AnchoredMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center justify-center rounded-md p-2
            focus:outline-none text-foreground focus:outline-none 
            ${isOpen ? "bg-surface-active" : "hover:bg-surface-hover"}
        `}
        aria-expanded={isOpen}
      >
        {button}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 min-w-max rounded-lg border-border bg-surface shadow-lg z-50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children({ closeMenu })}
        </div>
      )}
    </div>
  );
};

export default AnchoredMenu;
