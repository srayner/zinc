import { describe, expect, it } from "vitest";
import { CreateAreaSchema, LoginSchema, UpdateAreaSchema } from "@/schemas";

// The custom messages the area API and the login form return.
describe("area and login schema messages", () => {
  it.each([
    ["create: no zone", CreateAreaSchema, { zoneId: "", name: "Kitchen" }, "Zone is required"],
    ["create: blank name", CreateAreaSchema, { zoneId: "z1", name: "  " }, "Name is required"],
    ["update: blank name", UpdateAreaSchema, { name: "  " }, "Name is required"],
    ["login: bad email", LoginSchema, { email: "not-an-email", password: "x" }, "Email is required"],
    ["login: no password", LoginSchema, { email: "a@example.com", password: "" }, "Password is required"],
  ] as const)("%s gives its message", (_label, schema, input, message) => {
    const result = schema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toEqual([message]);
  });

  it("accepts valid input", () => {
    expect(CreateAreaSchema.safeParse({ zoneId: "z1", name: "Kitchen" }).success).toBe(true);
    expect(UpdateAreaSchema.safeParse({ archived: true }).success).toBe(true);
    expect(LoginSchema.safeParse({ email: "a@example.com", password: "x" }).success).toBe(true);
  });
});
