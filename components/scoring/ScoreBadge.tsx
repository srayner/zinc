import { cn } from "@/lib/utils";
import { scoreColour } from "@/lib/scoring";

export function ScoreBadge({
  score,
  className,
}: {
  score: number | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-9 items-center justify-center rounded-full px-2 py-0.5 text-sm font-semibold tabular-nums",
        scoreColour(score),
        className
      )}
    >
      {score === null ? "—" : score.toFixed(1)}
    </span>
  );
}
