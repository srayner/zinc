import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Email is required" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
