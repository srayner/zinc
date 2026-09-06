import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["lib/**", "services/**", "actions/**", "app/api/**"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: [
            "lib/**/*.test.{ts,tsx}",
            "services/**/*.test.{ts,tsx}",
            "actions/**/*.test.{ts,tsx}",
            "schemas/**/*.test.{ts,tsx}",
            "app/api/**/*.test.{ts,tsx}",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "components",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["components/**/*.test.{ts,tsx}", "hooks/**/*.test.{ts,tsx}"],
        },
      },
    ],
  },
});
