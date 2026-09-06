import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModeToggle } from "@/components/theme/ModeToggle";

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <ModeToggle />
    </ThemeProvider>
  );
}

describe("ModeToggle", () => {
  it("renders an accessible theme trigger", () => {
    renderToggle();
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("opens a menu with light, dark and system options", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(await screen.findByRole("menuitem", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Dark" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "System" })).toBeInTheDocument();
  });
});
