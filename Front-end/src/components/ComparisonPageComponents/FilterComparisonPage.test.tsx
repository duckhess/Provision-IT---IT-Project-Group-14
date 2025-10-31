/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import FilterComparisonPage from "./FilterComparisonPage";
import { vi } from "vitest";
import type { Mock } from "vitest";
import type { Dataset } from "../Types/Types";

// ---- Mock dependencies ----
vi.mock('../../utils/MetricFormatting/MetricFormat', () => ({
  fetchCompanyDatasets: vi.fn(),
}));

vi.mock("../GraphComponents/GraphButton.tsx", () => ({
  GraphButton: ({ selectedKeys }: any) => (
    <div data-testid="graph-button">Graphs for: {selectedKeys.join(",")}</div>
  ),
}));

vi.mock("../filterBusinessPage/sideBar/SideBarFilterButton", () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    <button data-testid="open-sidebar" onClick={onClick}>
      Toggle Sidebar
    </button>
  ),
}));

vi.mock("../filterBusinessPage/sideBar/SidebarFilter", () => ({
  __esModule: true,
  default: ({ onClose, toggleSelection }: any) => (
    <div data-testid="sidebar">
      <button
        data-testid="select-dataset"
        onClick={() => toggleSelection("Revenue__income_statements")}
      >
        Select Revenue
      </button>
      <button data-testid="close-sidebar" onClick={onClose}>
        Close Sidebar
      </button>
    </div>
  ),
}));

// ---- Imports after mocks ----
import { fetchCompanyDatasets } from "../../utils/MetricFormatting/MetricFormat.tsx";

// ---- Mock Data ----
const mockDatasetA: Dataset[] = [
  { name: "Revenue", metric: "income_statements", unit: "$", data: [] },
  { name: "Profit", metric: "income_statements", unit: "$", data: [] },
];

const mockDatasetB: Dataset[] = [
  { name: "Revenue", metric: "income_statements", unit: "$", data: [] },
];

// ---- Tests ----
describe("FilterComparisonPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Use mockImplementation to reliably return datasets per company
    (fetchCompanyDatasets as unknown as Mock).mockImplementation(
      (companyId: number) => {
        if (companyId === 1) return Promise.resolve(mockDatasetA);
        if (companyId === 2) return Promise.resolve(mockDatasetB);
        return Promise.resolve([]);
      }
    );
  });

  it("fetches datasets for both companies on mount", async () => {
    render(
      <FilterComparisonPage
        companyA={{ companyId: 1, companyName: "A Corp" }}
        companyB={{ companyId: 2, companyName: "B Corp" }}
      />
    );

    await waitFor(() =>
      expect(fetchCompanyDatasets).toHaveBeenCalledTimes(2)
    );
    await waitFor(() =>
      expect(fetchCompanyDatasets).toHaveBeenCalledWith(1)
    );
    await waitFor(() =>
      expect(fetchCompanyDatasets).toHaveBeenCalledWith(2)
    );
  });

  it("toggles sidebar visibility when button is clicked", async () => {
    render(
      <FilterComparisonPage
        companyA={{ companyId: 1, companyName: "A Corp" }}
        companyB={{ companyId: 2, companyName: "B Corp" }}
      />
    );

    const openBtn = screen.getByTestId("open-sidebar");
    fireEvent.click(openBtn);
    expect(await screen.findByTestId("sidebar")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-sidebar"));
    await waitFor(() =>
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument()
    );
  });

  it("updates selectedKeys and renders GraphButton after selection", async () => {
    render(
      <FilterComparisonPage
        companyA={{ companyId: 1, companyName: "A Corp" }}
        companyB={{ companyId: 2, companyName: "B Corp" }}
      />
    );

    // Open sidebar
    fireEvent.click(screen.getByTestId("open-sidebar"));
    expect(await screen.findByTestId("sidebar")).toBeInTheDocument();

    // Select a dataset
    fireEvent.click(screen.getByTestId("select-dataset"));

    // Close sidebar (generates finalSelectedKeys)
    fireEvent.click(screen.getByTestId("close-sidebar"));

    await waitFor(() =>
      expect(screen.getByTestId("graph-button")).toBeInTheDocument()
    );

    expect(screen.getByText(/Revenue__income_statements/i)).toBeInTheDocument();
  });

  it("renders nothing if no companies or no selections", () => {
    render(<FilterComparisonPage companyA={null} companyB={null} />);

    // GraphButton should never render
    expect(screen.queryByTestId("graph-button")).not.toBeInTheDocument();
  });
});
