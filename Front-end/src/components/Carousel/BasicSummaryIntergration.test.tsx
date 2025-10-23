// Summary.integration.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Summary from "./BasicSummary"; // adjust the path
import axios from "axios";
import { vi } from "vitest";
import type {Mock} from "vitest";

// Mock axios globally
vi.mock("axios");
const mockedAxiosGet = axios.get as unknown as Mock;

const company = { companyId: 1, companyName: "Test Company" };

describe("Summary Component Integration Test", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches company data and renders UI correctly", async () => {
    // Mock API response
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

    // Render component with routing context
    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    // Step 1: Loading state should appear initially
    expect(screen.getByText(/loading company info/i)).toBeInTheDocument();

    // Step 2: Wait for API fetch to complete
    await waitFor(() => {
      // Company info should be rendered
      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.getByText("Tech")).toBeInTheDocument();
      expect(screen.getByText(/Test description/i)).toBeInTheDocument();
      expect(screen.getByText(/Funding needed: \$1,000,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Use of Funds: Expansion/i)).toBeInTheDocument();
      // The loading text should be gone
      expect(screen.queryByText(/loading company info/i)).not.toBeInTheDocument();
    });

    // Step 3: Check "View More" link
    const link = screen.getByText(/View More/i);
    expect(link).toHaveAttribute("href", "/business/1");

  });

  it("shows fallback data when API fails", async () => {
    mockedAxiosGet.mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter>
        <Summary company={company} />
      </MemoryRouter>
    );

    // Wait for fallback content
    await waitFor(() => {
      expect(screen.getByText(/no company name/i)).toBeInTheDocument();
      expect(screen.getByText(/funding is missing/i)).toBeInTheDocument();
      expect(screen.queryByText(/loading company info/i)).not.toBeInTheDocument();
    });
  });

});
