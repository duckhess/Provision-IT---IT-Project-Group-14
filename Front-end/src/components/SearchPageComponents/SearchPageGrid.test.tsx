import { render, screen, waitFor } from "@testing-library/react";
import SearchPageGrid from "./SearchPageGrid";
import axios from "axios";

// Mock child components 
vi.mock("../GraphComponents/EGSScore/EGSScore", () => ({
  default: ({ social, environment, governance }: any) => (
    <div data-testid="EGSScore">
      EGSScore - E:{environment} S:{social} G:{governance}
    </div>
  ),
}));

vi.mock("../GraphComponents/CovenantsSummary/CovenantsSummary", () => ({
  default: ({ applicationId }: any) => (
    <div data-testid="CovenantsSummary">CovenantsSummary - AppID:{applicationId}</div>
  ),
}));

vi.mock("../GraphComponents/Graph", () => ({
  default: ({ title }: any) => (
    <div data-testid="Graph">Graph - Title:{title}</div>
  ),
}));

// Mock Axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SearchPageGrid Integration Test", () => {
  const mockCompany = { companyId: 1, companyName: "TestCo" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls all APIs with correct params and renders all child components", async () => {
    // Mock API responses
    mockedAxios.get
      .mockResolvedValueOnce({
        data: [
          {
            ApplicationID: 100,
            SocialScore: 75,
            EnvironmentalScore: 80,
            GovernanceScore: 85,
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            Table: "Best Metrics",
            MetricName: "Return on Equity",
            Unit: "%",
            Data: [
              { Timeline: 2022, Value: 50 },
              { Timeline: 2023, Value: 60 },
            ],
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            MetricName: "Working Capital",
            Unit: "$",
            "Avg Historical Forecast": 100,
            "User Forecast": 120,
          },
        ],
      });

    render(<SearchPageGrid company={mockCompany} />);

    // Verify API calls
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/company_data?CompanyID=1");
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/best_data?CompanyID=1");
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/working_capital_movements?ApplicationID=100"
      );
    });

    // Verify child components rendered with correct props
    expect(await screen.findByTestId("EGSScore")).toHaveTextContent("E:80 S:75 G:85");
    expect(await screen.findByTestId("CovenantsSummary")).toHaveTextContent("AppID:100");
    expect(await screen.findAllByTestId("Graph")).toHaveLength(2);
    expect(await screen.findByText(/Working Capital Movement/i)).toBeInTheDocument;
  });

  test("renders 'No data available' when company prop is null", () => {
    render(<SearchPageGrid company={null} />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  test("handles empty company_data response gracefully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<SearchPageGrid company={mockCompany} />);

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });

  test("handles API failure gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<SearchPageGrid company={mockCompany} />);

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });

  test("renders correct grid layout structure", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: [
          {
            ApplicationID: 200,
            SocialScore: 70,
            EnvironmentalScore: 60,
            GovernanceScore: 90,
          },
        ],
      })
      .mockResolvedValueOnce({ data: [] }) // best_data
      .mockResolvedValueOnce({ data: [] }); // working_capital

    render(<SearchPageGrid company={mockCompany} />);

    const grid = await screen.findByRole("grid", { hidden: true });
    expect(grid).toBeInTheDocument();

    // Expect 4 child containers (2x2)
    const children = grid.querySelectorAll("div.overflow-y-auto");
    expect(children.length).toBe(4);
  });
});