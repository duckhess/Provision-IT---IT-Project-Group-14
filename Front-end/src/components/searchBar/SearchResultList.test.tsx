import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchResultList } from "./SearchResultList";

describe("SearchResultList", () => {

  const companies = [
    { companyId: 1, companyName: "Company A" },
    { companyId: 2, companyName: "Company B" },
  ];

  it("renders nothing if results are empty", () => {
    const mockOnSelect = vi.fn();
    const { container } = render(<SearchResultList results={[]} onSelect={mockOnSelect} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a SearchResult for each company", () => {
    const mockOnSelect = vi.fn();
    render(<SearchResultList results={companies} onSelect={mockOnSelect} />);

    // Check that both company names are in the document
    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Company B")).toBeInTheDocument();
  });

  it("calls onSelect when a company is clicked", () => {
    const mockOnSelect = vi.fn();
    render(<SearchResultList results={companies} onSelect={mockOnSelect} />);

    // Simulate click on first company
    fireEvent.click(screen.getByText("Company A"));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(companies[0]);

    // Simulate click on second company
    fireEvent.click(screen.getByText("Company B"));

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect).toHaveBeenCalledWith(companies[1]);
  });

});
