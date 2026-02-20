const Modal = ({
  isOpen,
  onClose,
  children,
  scrollable,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  scrollable?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 cursor-auto">
      <div
        className={`bg-background border border-border rounded-lg p-6 relative max-w-sm md:max-w-3xl w-full max-h-[75dvh] flex flex-col 
          ${scrollable ? "overflow-auto" : "overflow-hidden"}
        `}
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
  );
};

export default Modal;
