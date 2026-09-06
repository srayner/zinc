"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { LoginSchema, type LoginInput } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function login(values: LoginInput): Promise<{ error: string } | void> {
  const parsed = LoginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
      return { error: "Something went wrong" };
    }
    throw error;
  }
}
