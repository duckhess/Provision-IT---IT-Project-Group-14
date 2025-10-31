import { render, screen, fireEvent, waitFor,within } from "@testing-library/react";
import FilterSearchPage from "./FilterSearchPage";
import axios from "axios";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock axios only 
vi.mock("axios");
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };
mockedAxios.get = vi.fn();

describe("FilterSearchPage Integration Test", () => {
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
      Location: "Sydney",
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
      Location: "Melbourne",
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

  it("fetches data, opens overlay, applies filters, and updates results", async () => {
    // Mock API calls
    mockedAxios.get.mockResolvedValueOnce({ data: [backendData[0]] });
    mockedAxios.get.mockResolvedValueOnce({ data: [backendData[1]] });

    render(
      <FilterSearchPage
        allCompanies={mockCompanies}
        setSearchResults={mockSetSearchResults}
      />
    );

    // Wait for initial data fetch
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    // Open the overlay 
    const filterButton = screen.getByRole("button", { name: /Filters/i });
    fireEvent.click(filterButton);

    // Check that overlay is visible
    const overlay = await screen.findByTestId("overlay");
    expect(overlay).toBeInTheDocument();

    // Select filters in overlay 
    const placeholder = screen.getByText("Select location");
    await userEvent.click(placeholder);

    const sydneyOption = await screen.getByText("Sydney");
    await userEvent.click(sydneyOption);

    // Click "Filter" in overlay
    const applyButton = within(overlay).getByRole("button", { name: /Filter/i });
    expect(applyButton).toBeInTheDocument()

    fireEvent.click(applyButton)

    // Overlay should close
    await waitFor(() => {
      expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    });

    // setSearchResults should be called with filtered results
    await waitFor(() => {
      expect(mockSetSearchResults).toHaveBeenCalled();
      const results = mockSetSearchResults.mock.calls[0][0];
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
