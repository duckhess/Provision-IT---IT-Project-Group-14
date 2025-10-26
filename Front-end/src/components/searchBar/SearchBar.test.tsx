import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  const allCompanies = [
    { companyId: 1, companyName: "Apple" },
    { companyId: 2, companyName: "Google" },
    { companyId: 3, companyName: "Microsoft" },
  ];

  it("updates suggested companies as user types", () => {
    const mockSetSuggested = vi.fn();
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBar
        allCompanies={allCompanies}
        setSuggested={mockSetSuggested}
        setSearchResults={mockSetSearchResults}
      />
    );

    // Simulate typing "go"
    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "go" } });

    // Expect setSuggested to have been called with "Google"
    expect(mockSetSuggested).toHaveBeenCalledWith([
      { companyId: 2, companyName: "Google" },
    ]);
  });

  it("calls setSearchResults and clears suggestions when search icon is clicked (no custom handler)", () => {
    const mockSetSuggested = vi.fn();
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBar
        allCompanies={allCompanies}
        setSuggested={mockSetSuggested}
        setSearchResults={mockSetSearchResults}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    const searchIcon = screen.getByTestId("search-icon");
    // Type "app"
    fireEvent.change(input, { target: { value: "app" } });

    // Click search icon
    fireEvent.click(searchIcon);

    // Should call setSearchResults with filtered companies
    expect(mockSetSearchResults).toHaveBeenCalledWith([
      { companyId: 1, companyName: "Apple" },
    ]);

    // Should clear suggestions
    expect(mockSetSuggested).toHaveBeenCalledWith([]);
  });

  it("calls custom handleSearchClick and clears suggestions", () => {
    const mockHandleSearchClick = vi.fn();
    const mockSetSuggested = vi.fn();
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBar
        allCompanies={allCompanies}
        setSuggested={mockSetSuggested}
        setSearchResults={mockSetSearchResults}
        handleSearchClick={mockHandleSearchClick}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    const searchIcon = screen.getByTestId("search-icon");

    // Type "micro"
    fireEvent.change(input, { target: { value: "micro" } });

    // Click search icon
    fireEvent.click(searchIcon);

    // Should call custom handler with trimmed input
    expect(mockHandleSearchClick).toHaveBeenCalledWith("micro");

    // Should clear suggestions
    expect(mockSetSuggested).toHaveBeenCalledWith([]);

    // Should NOT call setSearchResults directly
    expect(mockSetSearchResults).not.toHaveBeenCalled();
  });
});
