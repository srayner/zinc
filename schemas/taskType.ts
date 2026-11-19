import { z } from "zod";
import { EffortLevel, ZoneType } from "@/lib/generated/prisma/enums";

const seasonalMultipliers = z
  .array(z.number().positive().max(10))
  .length(12, { error: "Provide exactly 12 monthly multipliers" });

export const CreateTaskTypeSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }).max(100),
  defaultFrequencyDays: z
    .number({ error: "Frequency is required" })
    .int({ error: "Frequency must be a whole number of days" })
    .positive({ error: "Frequency must be at least 1 day" })
    .max(3650),
  defaultWeight: z
    .number({ error: "Weight is required" })
    .positive({ error: "Weight must be greater than 0" })
    .max(10),
  effortLevel: z.enum(EffortLevel),
  applicableZoneTypes: z
    .array(z.enum(ZoneType))
    .min(1, { error: "Pick at least one zone" }),
  seasonalMultipliers,
});

export const UpdateTaskTypeSchema = CreateTaskTypeSchema.partial();

export type CreateTaskTypeInput = z.infer<typeof CreateTaskTypeSchema>;
export type UpdateTaskTypeInput = z.infer<typeof UpdateTaskTypeSchema>;
