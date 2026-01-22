import type { InputHTMLAttributes } from "react";

type FloatingInputProps = {
  id: string;
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder">;

const FloatingInput = ({ 
  id, 
  label,
  className,
  type = "text", 
  required,
  ...props
}: FloatingInputProps) => {
  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        {...props}
        type={type}
        required={required}
        className={`peer h-12 w-full border-b-2 border-border text-foreground placeholder-transparent focus:outline-none focus:border-accent ${className ?? ""}`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 -top-3.5 text-foreground-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-foreground-muted peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-foreground peer-focus:text-sm"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
    </div>
  );
};

export default FloatingInput;
