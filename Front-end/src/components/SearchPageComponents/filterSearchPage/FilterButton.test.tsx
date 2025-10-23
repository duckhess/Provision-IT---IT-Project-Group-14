import { render, screen, fireEvent } from "@testing-library/react";
import FilterButton from "./FilterButton";
import { vi } from "vitest";

describe("FilterButton Component", () => {
  it("renders without crashing", () => {
    render(<FilterButton onClick={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays the text 'Filters'", () => {
    render(<FilterButton onClick={() => {}} />);
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });

  it("renders the plus icon", () => {
    render(<FilterButton onClick={() => {}} />);

    const plusIcon = screen.getByTestId("plusIcon");
    expect(plusIcon).toBeInTheDocument();
  });

  it("calls onClick when the button is clicked", () => {
    const mockFn = vi.fn();
    render(<FilterButton onClick={mockFn} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("has the correct base styling classes", () => {
    render(<FilterButton onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-white");
    expect(button.className).toContain("rounded-lg");
  });
});
