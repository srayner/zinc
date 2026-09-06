import { afterEach, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { mockReset } from "vitest-mock-extended";
import { prismaMock } from "./test/mocks/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// jsdom has no matchMedia; next-themes and responsive hooks need it.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

beforeEach(() => {
  mockReset(prismaMock);
});

afterEach(() => {
  cleanup();
});
