/**
 * `motion-reduce:animate-none` rather than a JS check: the pulse is decoration,
 * and Tailwind's variant costs nothing at runtime.
 */
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-line/60 rounded animate-pulse motion-reduce:animate-none ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonRows = ({ count }: { count: number }) => (
  <div className="space-y-2" role="status" aria-label="Loading">
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 bg-white border border-line rounded-xl px-5 py-4"
      >
        <Skeleton className="h-4 w-4 shrink-0" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
    ))}
  </div>
);

export default Skeleton;
