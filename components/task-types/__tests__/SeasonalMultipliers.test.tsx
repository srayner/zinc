import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SeasonalMultipliers } from "@/components/task-types/SeasonalMultipliers";

function Harness({
  initial = Array(12).fill(1),
  onChangeSpy,
}: {
  initial?: number[];
  onChangeSpy?: (next: number[]) => void;
}) {
  const [value, setValue] = useState<number[]>(initial);
  return (
    <SeasonalMultipliers
      value={value}
      onChange={(next) => {
        setValue(next);
        onChangeSpy?.(next);
      }}
    />
  );
}

describe("SeasonalMultipliers", () => {
  it("renders twelve month inputs", () => {
    render(<SeasonalMultipliers value={Array(12).fill(1)} onChange={() => {}} />);
    expect(screen.getByLabelText("Jan")).toBeInTheDocument();
    expect(screen.getByLabelText("Dec")).toBeInTheDocument();
    expect(screen.getAllByRole("spinbutton")).toHaveLength(12);
  });

  it("updates only the edited month", () => {
    const spy = vi.fn();
    render(<Harness onChangeSpy={spy} />);

    fireEvent.change(screen.getByLabelText("Jun"), { target: { value: "0.5" } });

    const last = spy.mock.calls.at(-1)![0] as number[];
    expect(last[5]).toBe(0.5);
    expect(last[0]).toBe(1);
    expect(last).toHaveLength(12);
  });

  it("reset button emits twelve neutral values", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <Harness
        initial={[3, 3, 1.5, 1, 0.6, 0.5, 0.5, 0.6, 0.9, 1.5, 2.5, 3]}
        onChangeSpy={spy}
      />
    );

    await user.click(screen.getByRole("button", { name: /reset to neutral/i }));

    expect(spy).toHaveBeenCalledWith(Array(12).fill(1));
  });

  it("shows an error message when provided", () => {
    render(
      <SeasonalMultipliers
        value={Array(12).fill(1)}
        onChange={() => {}}
        error="Provide exactly 12 monthly multipliers"
      />
    );
    expect(
      screen.getByText("Provide exactly 12 monthly multipliers")
    ).toBeInTheDocument();
  });
});
