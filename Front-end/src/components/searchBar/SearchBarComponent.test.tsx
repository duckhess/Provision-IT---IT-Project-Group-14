import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchBarComponent from "./SearchBarComponent";

describe("SearchBarComponent", () => {
  const allCompanies = [
    { companyId: 1, companyName: "Apple" },
    { companyId: 2, companyName: "Google" },
    { companyId: 3, companyName: "Microsoft" },
  ];

  it("renders SearchBar and SearchResultList", () => {
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBarComponent
        allCompanies={allCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    expect(screen.getByPlaceholderText("Type to search...")).toBeInTheDocument();
  });

  it("updates SearchResultList when typing in SearchBar", () => {
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBarComponent
        allCompanies={allCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "go" } });

    // Expect Google to appear as a suggestion
    expect(screen.getByText("Google")).toBeInTheDocument();
  });

  // click on a suggested company
  it("selecting a suggestion calls setSearchResults and clears suggestions", () => {
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBarComponent
        allCompanies={allCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "app" } });

    // Suggestion should appear
    const suggestion = screen.getByText("Apple");
    fireEvent.click(suggestion);

    // Expect Apple to be set as the only search result
    expect(mockSetSearchResults).toHaveBeenCalledWith([
      { companyId: 1, companyName: "Apple" },
    ]);

    // Suggestion list should be cleared
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("clicking search icon filters companies (default behavior)", () => {
    const mockSetSearchResults = vi.fn();

    render(
      <SearchBarComponent
        allCompanies={allCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "micro" } });

    const searchIcon = screen.getByTestId("search-icon");
    fireEvent.click(searchIcon);

    expect(mockSetSearchResults).toHaveBeenCalledWith([
      { companyId: 3, companyName: "Microsoft" },
    ]);
  });

  it("calls custom handleSearchClick when provided", () => {
    const mockSetSearchResults = vi.fn();
    const mockHandleSearchClick = vi.fn();

    render(
      <SearchBarComponent
        allCompanies={allCompanies}
        setSearchResults={mockSetSearchResults}
        handleSearchClick={mockHandleSearchClick}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "google" } });

    const searchIcon = screen.getByTestId("search-icon");
    fireEvent.click(searchIcon);

    expect(mockHandleSearchClick).toHaveBeenCalledWith("google");
    expect(mockSetSearchResults).not.toHaveBeenCalled();
  });
});
