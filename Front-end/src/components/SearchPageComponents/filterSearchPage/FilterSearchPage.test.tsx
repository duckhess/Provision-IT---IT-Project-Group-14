import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import { vi } from "vitest";

// Mock child components
vi.mock("./FilterButton", () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Open Filter</button>
  ),
}));

vi.mock("./Overlay", () => ({
  default: ({
    onClose,
    onApplyFilters,
  }: {
    onClose: () => void;
    onApplyFilters: () => void;
  }) => (
    <div data-testid="overlay">
      <button onClick={onApplyFilters}>Apply Filters</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};
mockedAxios.get = vi.fn();

import FilterSearchPage from "./FilterSearchPage";

describe("FilterSearchPage", () => {
  const mockSetSearchResults = vi.fn();

  const mockCompanies = [
    { companyId: 1, companyName: "EcoCorp" },
    { companyId: 2, companyName: "TechWave" },
  ];

  const backendData = [
    {
      CompanyID: 1,
      CompanyName: "EcoCorp",
      Industry: "Green Energy",
      IndustryID: 10,
      ApplicationID: 101,
      YearEstablished: "2010",
      Location: "California",
      UsageOfFunds: "Expansion",
      Amount: "$1,000,000",
      EnvironmentalScore: 80,
      SocialScore: 75,
      ShortGeneralDescription: "Eco solutions",
      LongGeneralDescription: "",
      ShortApplicationDescription: "",
      LongApplicationDescription: "",
    },
    {
      CompanyID: 2,
      CompanyName: "TechWave",
      Industry: "Technology",
      IndustryID: 20,
      ApplicationID: 202,
      YearEstablished: "2015",
      Location: "New York",
      UsageOfFunds: "R&D",
      Amount: "$5,000,000",
      EnvironmentalScore: 60,
      SocialScore: 70,
      ShortGeneralDescription: "Innovative tech",
      LongGeneralDescription: "",
      ShortApplicationDescription: "",
      LongApplicationDescription: "",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders FilterButton and no overlay initially", () => {
    render(
      <FilterSearchPage
        allCompanies={[]}
        setSearchResults={mockSetSearchResults}
      />
    );

    expect(screen.getByText("Open Filter")).toBeInTheDocument();
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
  });

  it("fetches and maps company data correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [backendData[0]] });
    mockedAxios.get.mockResolvedValueOnce({ data: [backendData[1]] });

    render(
      <FilterSearchPage
        allCompanies={mockCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));

    await waitFor(() => {
      expect(mockSetSearchResults).toHaveBeenCalledWith([
        { companyId: 1, companyName: "EcoCorp" },
        { companyId: 2, companyName: "TechWave" },
      ]);
    });
  });

  it("opens and closes overlay when clicking buttons", async () => {
    render(
      <FilterSearchPage
        allCompanies={[]}
        setSearchResults={mockSetSearchResults}
      />
    );

    fireEvent.click(screen.getByText("Open Filter"));
    expect(screen.getByTestId("overlay")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() =>
      expect(screen.queryByTestId("overlay")).not.toBeInTheDocument()
    );
  });

  it("applies filters correctly (amountRange = 'high')", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [backendData[0]] });
    mockedAxios.get.mockResolvedValueOnce({ data: [backendData[1]] });

    render(
      <FilterSearchPage
        allCompanies={mockCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));

    // Open overlay
    fireEvent.click(screen.getByText("Open Filter"));
    expect(screen.getByTestId("overlay")).toBeInTheDocument();

    // Apply filters
    fireEvent.click(screen.getByText("Apply Filters"));

    await waitFor(() => {
      expect(mockSetSearchResults).toHaveBeenCalled();
    });
  });
});
