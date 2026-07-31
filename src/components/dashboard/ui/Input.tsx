import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

const Input = ({ icon, className = "", ...rest }: Props) => (
  <div className="relative flex-1 min-w-0">
    {icon && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
        {icon}
      </span>
    )}
    <input
      className={`w-full ${icon ? "pl-9" : "pl-4"} pr-4 py-2.5 bg-white border border-line rounded-lg text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-colors ${className}`}
      {...rest}
    />
  </div>
);

export default Input;
