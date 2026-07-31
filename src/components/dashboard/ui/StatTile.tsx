import Card from "./Card";

/**
 * `tabular-nums` matters more than it looks: without it the counts jitter
 * horizontally as they change, which reads as the page flickering.
 */
const StatTile = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) => (
  <Card className="px-5 py-4">
    <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
      {label}
    </p>
    <p className="text-2xl font-bold text-ink mt-1 tabular-nums">{value}</p>
    {hint && <p className="text-xs text-muted mt-0.5">{hint}</p>}
  </Card>
);

export default StatTile;
