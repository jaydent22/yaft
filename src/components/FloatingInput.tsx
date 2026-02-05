import type { InputHTMLAttributes } from "react";

type FloatingInputProps = {
  id: string;
  label: string;
  variant?: "default" | "title";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder">;

const variants = {
  default: {
    input: "h-12 text-base font-normal",
    label: "text-sm -top-3.5 peer-placeholder-shown:top-2 peer-focus:-top-3.5",
  },
  title: {
    input: "h-16 text-2xl font-semibold",
    label: "text-lg -top-4 peer-placeholder-shown:top-3 peer-focus:-top-4",
  },
};

const FloatingInput = ({
  id,
  label,
  variant = "default",
  className,
  type = "text",
  required,
  ...props
}: FloatingInputProps) => {
  const styles = variants[variant];

  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        {...props}
        type={type}
        required={required}
        className={`peer w-full border-b-2 border-border text-foreground placeholder-transparent focus:outline-none focus:border-accent ${
          styles.input
        } ${className ?? ""}`}
      />
      <label
        htmlFor={id}
        className={`
        pointer-events-none absolute left-0 -top-3.5 text-foreground-muted transition-all peer-focus:text-sm peer-focus:text-foreground ${styles.label}`}
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
    </div>
  );
};

export default FloatingInput;
