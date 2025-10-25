import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DropdownFilter from "./DropdownFilter";
import { vi } from "vitest";

describe("DropdownFilter Component", () => {

  const defaultProps = {
    title: "Category",
    options: ["Tech", "Finance"],
    value: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with title and placeholder", () => {
    render(<DropdownFilter {...defaultProps} />);

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  it("opens and closes the dropdown when clicked", async () => {
    render(<DropdownFilter {...defaultProps} />);

    const trigger = screen.getByTestId("dropdownTrigger");

    // Initially closed
    expect(screen.queryByTestId("dropdownOptions")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(trigger);
    expect(screen.getByTestId("dropdownOptions")).toBeInTheDocument();

    // Click again to close
    fireEvent.click(trigger);
    await waitFor(() => {
        expect(screen.queryByTestId("dropdownOptions")).not.toBeInTheDocument();
    });
  });

  it("calls onChange with selected option", async () => {
    const handleChange = vi.fn();
    render(<DropdownFilter {...defaultProps} onChange={handleChange} />);

    // Open dropdown and select option
    fireEvent.click(screen.getByText("Select category"));
    fireEvent.click(screen.getByText("Tech"));

    expect(handleChange).toHaveBeenCalledWith("Tech");
    await waitFor(() => {
      expect(screen.queryByText("Tech")).not.toBeInTheDocument(); // dropdown closed
    });
  });

  it("calls onChange with empty string when clicking placeholder", () => {
    const handleChange = vi.fn();
    render(<DropdownFilter {...defaultProps} value="Tech" onChange={handleChange} />);

    fireEvent.click(screen.getByText("Tech"));
    fireEvent.click(screen.getByText("Select category"));

    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("closes dropdown when clicking outside", () => {
    const handleChange = vi.fn();

    render(
      <>
        <DropdownFilter {...defaultProps} onChange={handleChange} />
        <div data-testid="outside">Outside</div>
      </>
    );

    fireEvent.click(screen.getByText("Select category")); // open dropdown
    expect(screen.getByText("Tech")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside")); // click outside
    expect(screen.queryByText("Tech")).not.toBeInTheDocument();
  });
});
