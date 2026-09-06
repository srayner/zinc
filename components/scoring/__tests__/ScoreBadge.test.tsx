import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreBadge } from "@/components/scoring/ScoreBadge";

describe("ScoreBadge", () => {
  it("renders a dash and the unscored style when score is null", () => {
    render(<ScoreBadge score={null} />);
    const badge = screen.getByText("—");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-neutral-200");
  });

  it("renders the score to one decimal with an honest low-score colour", () => {
    render(<ScoreBadge score={2.4} />);
    const badge = screen.getByText("2.4");
    expect(badge.className).toContain("bg-red-600");
  });

  it("uses the excellent colour for a high score", () => {
    render(<ScoreBadge score={9.5} />);
    expect(screen.getByText("9.5").className).toContain("bg-green-600");
  });
});
