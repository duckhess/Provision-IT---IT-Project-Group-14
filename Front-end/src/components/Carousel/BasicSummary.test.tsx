// Summary.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import Summary from "./BasicSummary"; // adjust path if needed
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";
import type { Mock } from "vitest";

// Mock axios module
vi.mock("axios");

// Cast axios.get to Vitest mock type
const mockedAxiosGet = axios.get as unknown as Mock;

const company = { companyId: 1, companyName: "Test Company" };

describe("Summary Component", () => {

  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it("shows loading initially", () => {
    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading company info/i)).toBeInTheDocument();
  });

  it("renders company data after successful fetch", async () => {
    mockedAxiosGet.mockResolvedValueOnce({
      data: [
        {
          CompanyID: 1,
          CompanyName: "Test Company",
          Industry: "Tech",
          ShortGeneralDescription: "Test description",
          Amount: "$1,000,000",
          UsageOfFunds: "Expansion",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.getByText("Tech")).toBeInTheDocument();
      expect(screen.getByText(/Test description/i)).toBeInTheDocument();
      expect(screen.getByText(/Funding needed: \$1,000,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Use of Funds: Expansion/i)).toBeInTheDocument();
    });
  });

  it("renders fallback data when API returns empty array", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no company name/i)).toBeInTheDocument();
      expect(screen.getByText(/no industry category/i)).toBeInTheDocument();
      expect(screen.getByText(/no company description/i)).toBeInTheDocument();
      expect(screen.getByText(/funding is missing/i)).toBeInTheDocument();
      expect(screen.getByText(/no usage of funds/i)).toBeInTheDocument();
    });
  });

  it("renders correct 'View More' Link", async () => {
    mockedAxiosGet.mockResolvedValueOnce({
      data: [
        {
          CompanyID: 1,
          CompanyName: "Test Company",
          Industry: "Tech",
          ShortGeneralDescription: "Test description",
          Amount: "$1,000,000",
          UsageOfFunds: "Expansion",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const link = screen.getByText(/View More/i);
      expect(link).toHaveAttribute("href", "/business/1");
    });
  });

  it("handles API error gracefully", async () => {
    mockedAxiosGet.mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Component should not crash, and loading disappears
      expect(screen.queryByText(/Loading company info/i)).not.toBeInTheDocument();
       expect(screen.getByText(/no company name/i)).toBeInTheDocument();
      expect(screen.getByText(/no industry category/i)).toBeInTheDocument();
      expect(screen.getByText(/no company description/i)).toBeInTheDocument();
      expect(screen.getByText(/funding is missing/i)).toBeInTheDocument();
      expect(screen.getByText(/no usage of funds/i)).toBeInTheDocument();
    });
  });

});
