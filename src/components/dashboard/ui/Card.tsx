import type { ReactNode } from "react";

/**
 * The dashboard's one surface.
 *
 * White on the warm canvas with a hairline border and no shadow — the same
 * treatment the public pages use, so the admin reads as the same brand rather
 * than as a separate product.
 */
const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`bg-white border border-line rounded-xl ${className}`}>
    {children}
  </div>
);

export default Card;
