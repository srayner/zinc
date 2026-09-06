import { z } from "zod";

export const CreateAreaSchema = z.object({
  zoneId: z.string().min(1, { message: "Zone is required" }),
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
});

export const UpdateAreaSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100).optional(),
  archived: z.boolean().optional(),
});

export type CreateAreaInput = z.infer<typeof CreateAreaSchema>;
export type UpdateAreaInput = z.infer<typeof UpdateAreaSchema>;
