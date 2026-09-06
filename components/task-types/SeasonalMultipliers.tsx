"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MONTH_LABELS } from "@/lib/taskTypes";
import { NEUTRAL_SEASONAL_MULTIPLIERS } from "@/lib/scoring";

type Props = {
  value: number[];
  onChange: (next: number[]) => void;
  error?: string;
};

export function SeasonalMultipliers({ value, onChange, error }: Props) {
  function setMonth(index: number, raw: string) {
    const parsed = Number(raw);
    const next = [...value];
    next[index] = Number.isFinite(parsed) ? parsed : 0;
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Seasonal multipliers</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange([...NEUTRAL_SEASONAL_MULTIPLIERS])}
        >
          Reset to neutral
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {MONTH_LABELS.map((month, i) => (
          <div key={month} className="space-y-1">
            <Label
              htmlFor={`seasonal-${i}`}
              className="text-xs text-muted-foreground"
            >
              {month}
            </Label>
            <Input
              id={`seasonal-${i}`}
              type="number"
              step="0.1"
              min="0.1"
              inputMode="decimal"
              value={value[i] ?? 1}
              onChange={(e) => setMonth(i, e.target.value)}
              className="h-8 px-2"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        1 = normal. Below 1 means the task is needed more often that month
        (frequency interval shortens); above 1 means less often.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
