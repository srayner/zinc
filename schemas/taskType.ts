import { z } from "zod";
import { EffortLevel, ZoneType } from "@prisma/client";

const seasonalMultipliers = z
  .array(z.number().positive().max(10))
  .length(12, { message: "Provide exactly 12 monthly multipliers" });

export const CreateTaskTypeSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  defaultFrequencyDays: z
    .number({ invalid_type_error: "Frequency is required" })
    .int({ message: "Frequency must be a whole number of days" })
    .positive({ message: "Frequency must be at least 1 day" })
    .max(3650),
  defaultWeight: z
    .number({ invalid_type_error: "Weight is required" })
    .positive({ message: "Weight must be greater than 0" })
    .max(10),
  effortLevel: z.nativeEnum(EffortLevel),
  applicableZoneTypes: z
    .array(z.nativeEnum(ZoneType))
    .min(1, { message: "Pick at least one zone" }),
  seasonalMultipliers,
});

export const UpdateTaskTypeSchema = CreateTaskTypeSchema.partial();

export type CreateTaskTypeInput = z.infer<typeof CreateTaskTypeSchema>;
export type UpdateTaskTypeInput = z.infer<typeof UpdateTaskTypeSchema>;
