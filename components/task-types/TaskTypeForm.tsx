"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { TaskType } from "@/lib/generated/prisma/client";

import { CreateTaskTypeSchema, type CreateTaskTypeInput } from "@/schemas";
import {
  EFFORT_LEVELS,
  ZONE_TYPES,
  effortLabel,
  zoneLabel,
} from "@/lib/taskTypes";
import { NEUTRAL_SEASONAL_MULTIPLIERS } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeasonalMultipliers } from "@/components/task-types/SeasonalMultipliers";

type Props =
  | { mode: "create"; taskType?: undefined }
  | { mode: "edit"; taskType: TaskType };

export function TaskTypeForm({ mode, taskType }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTaskTypeInput>({
    resolver: zodResolver(CreateTaskTypeSchema),
    defaultValues: {
      name: taskType?.name ?? "",
      defaultFrequencyDays: taskType?.defaultFrequencyDays ?? 7,
      defaultWeight: taskType?.defaultWeight ?? 1,
      effortLevel: taskType?.effortLevel ?? "MEDIUM",
      applicableZoneTypes: taskType?.applicableZoneTypes ?? [],
      seasonalMultipliers:
        taskType?.seasonalMultipliers ?? [...NEUTRAL_SEASONAL_MULTIPLIERS],
    },
  });

  function onSubmit(values: CreateTaskTypeInput) {
    setFormError(null);
    startTransition(async () => {
      const res = await fetch(
        mode === "edit" ? `/api/task-types/${taskType.id}` : "/api/task-types",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error ?? "Could not save");
        return;
      }
      toast.success(mode === "edit" ? "Saved" : `Created ${values.name}`);
      router.push("/task-types");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="defaultFrequencyDays">Frequency (days)</Label>
          <Input
            id="defaultFrequencyDays"
            type="number"
            step="1"
            min="1"
            {...register("defaultFrequencyDays", { valueAsNumber: true })}
          />
          {errors.defaultFrequencyDays && (
            <p className="text-sm text-destructive">
              {errors.defaultFrequencyDays.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultWeight">Weight</Label>
          <Input
            id="defaultWeight"
            type="number"
            step="0.1"
            min="0.1"
            {...register("defaultWeight", { valueAsNumber: true })}
          />
          {errors.defaultWeight && (
            <p className="text-sm text-destructive">
              {errors.defaultWeight.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="effortLevel">Effort</Label>
          <select
            id="effortLevel"
            {...register("effortLevel")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {EFFORT_LEVELS.map((level) => (
              <option key={level} value={level}>
                {effortLabel(level)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Controller
        control={control}
        name="applicableZoneTypes"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Applicable zones</Label>
            <div className="flex flex-wrap gap-4">
              {ZONE_TYPES.map((zone) => {
                const checked = field.value?.includes(zone) ?? false;
                return (
                  <label
                    key={zone}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const set = new Set(field.value ?? []);
                        if (e.target.checked) set.add(zone);
                        else set.delete(zone);
                        field.onChange([...set]);
                      }}
                    />
                    {zoneLabel(zone)}
                  </label>
                );
              })}
            </div>
            {errors.applicableZoneTypes && (
              <p className="text-sm text-destructive">
                {errors.applicableZoneTypes.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="seasonalMultipliers"
        render={({ field }) => (
          <SeasonalMultipliers
            value={field.value ?? [...NEUTRAL_SEASONAL_MULTIPLIERS]}
            onChange={field.onChange}
            error={errors.seasonalMultipliers?.message as string | undefined}
          />
        )}
      />

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : mode === "edit" ? "Save changes" : "Create"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/task-types")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
