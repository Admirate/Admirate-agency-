import type { ReactNode } from "react";

const EmptyState = ({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-16">
    {icon && (
      <div className="w-12 h-12 rounded-full bg-warm border border-line flex items-center justify-center text-muted mb-4">
        {icon}
      </div>
    )}
    <p className="text-sm font-semibold text-ink">{title}</p>
    {body && <p className="text-sm text-muted mt-1 max-w-sm">{body}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
