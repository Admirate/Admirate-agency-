import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md";

/**
 * `danger` is deliberately distinct from `primary` despite both being red-ish:
 * primary is the brand fill used for the ordinary forward action, danger is
 * outlined and reserved for destruction, so "Send" and "Delete all" can never
 * be mistaken for one another at a glance.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand/90 border border-transparent",
  ghost: "bg-white text-ink border border-line hover:bg-warm",
  danger: "bg-white text-brand border border-brand/40 hover:bg-brand/5",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: Props) => (
  <button
    // A loading button is disabled: the guard belongs on the element rather
    // than on every call site, because a double-submit is a duplicate row.
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
