import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterBusinessPage from "./FilterBusinessPage";
import { vi } from "vitest";
import type { Dataset } from "../Types/Types";

vi.mock("../MetricFormatting/MetricFormat", () => ({
  fetchCompanyDatasets: vi.fn(),
}));

vi.mock("../GraphComponents/GraphButton", () => ({
  GraphButton: ({ selectedKeys }: any) => (
    <div data-testid="graph-button">Graphs for: {selectedKeys.join(",")}</div>
  ),
}));

vi.mock("./sideBar/SideBarFilterButton", () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    <button data-testid="open-sidebar" onClick={onClick}>
      Toggle Sidebar
    </button>
  ),
}));

vi.mock("./sideBar/SidebarFilter", () => ({
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

import { fetchCompanyDatasets } from "../MetricFormatting/MetricFormat";

const mockDatasetA: Dataset[] = [
  { name: "Revenue", metric: "income_statements", unit: "$", data: [] },
  { name: "Profit", metric: "income_statements", unit: "$", data: [] },
];

describe("FilterBusinessPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches datasets for companyA on mount", async () => {
    (fetchCompanyDatasets as any).mockResolvedValueOnce(mockDatasetA);

    render(
      <FilterBusinessPage companyA={{ companyId: 1, companyName: "A Corp" }} />
    );

    await waitFor(() => expect(fetchCompanyDatasets).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(fetchCompanyDatasets).toHaveBeenCalledWith(1)
    );
  });

  it("toggles sidebar visibility when button is clicked", async () => {
    (fetchCompanyDatasets as any).mockResolvedValueOnce(mockDatasetA);

    render(
      <FilterBusinessPage companyA={{ companyId: 1, companyName: "A Corp" }} />
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
    (fetchCompanyDatasets as any).mockResolvedValueOnce(mockDatasetA);

    render(
      <FilterBusinessPage companyA={{ companyId: 1, companyName: "A Corp" }} />
    );

    fireEvent.click(screen.getByTestId("open-sidebar"));
    fireEvent.click(screen.getByTestId("select-dataset"));
    fireEvent.click(screen.getByTestId("close-sidebar"));

    await waitFor(() =>
      expect(screen.getByTestId("graph-button")).toBeInTheDocument()
    );

    expect(screen.getByText(/Revenue__income_statements/i)).toBeInTheDocument();
  });

  it("renders nothing if no company or no selection", () => {
    render(<FilterBusinessPage companyA={null} />);
    expect(screen.queryByTestId("graph-button")).not.toBeInTheDocument();
  });
});
