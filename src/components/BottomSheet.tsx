const BottomSheet = ({
  isOpen,
  onClose,
  children,
  size = "auto",
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size: "content" | "auto";
  className?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75" onClick={onClose}>
      <div className="absolute inset-0 flex items-end justify-center">
        <div
          className={`relative w-full rounded-t-2xl bg-background p-4 border border-border ${
            size === "auto"
              ? "min-h-[25dvh] max-h-[75dvh] flex flex-col"
              : "h-auto max-h-[75dvh]"
          } ${className ?? ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground hover:text-foreground-muted cursor-pointer"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
