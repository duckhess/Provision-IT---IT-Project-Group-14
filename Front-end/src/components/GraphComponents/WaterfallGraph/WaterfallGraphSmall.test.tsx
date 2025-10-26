import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WaterfallGraphSmall from "./WaterfallGraphSmall.tsx";
import type { Dataset } from "../../Types/Types";

// --- Mock Recharts components to avoid SVG rendering complexity ---
vi.mock("recharts", async (importOriginal) => {
  const original: any = await importOriginal();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children }: any) => <div data-testid="mock-bar-chart">{children}</div>,
    CartesianGrid: () => <div data-testid="mock-grid" />,
    XAxis: () => <div data-testid="mock-xaxis" />,
    YAxis: () => <div data-testid="mock-yaxis" />,
    Tooltip: () => <div data-testid="mock-tooltip" />,
    Bar: ({ children, dataKey }: any) => (
      <div data-testid={`mock-bar-${dataKey}`}>{children}</div>
    ),
    Cell: ({ fill }: any) => <div data-testid={`mock-cell-${fill}`} />,
  };
});

// --- Mock dataset (similar to your real structure) ---
const mockDatasets: Dataset[] = [
  {
    name: "Operating Cycle",
    data: [
      { x: 2023, y: 3.28 },
      { x: 2024, y: 3.12 },
    ],
    metric: "Key Ratios",
    unit: "days",
  },
  {
    name: "Quick Ratio (Acid Test)",
    data: [
      { x: 2023, y: 1.87 },
      { x: 2024, y: 1.39 },
    ],
    metric: "Key Ratios",
    unit: "days",
  },
];

const mockMergedSets = [
  { x: 2023, "Operating Cycle": 3.28, "Quick Ratio (Acid Test)": 1.87 },
  { x: 2024, "Operating Cycle": 3.12, "Quick Ratio (Acid Test)": 1.39 },
];

// --- Tests ---
describe("WaterfallGraphSmall", () => {
  it("renders the chart title", () => {
    render(<WaterfallGraphSmall mergedSets={mockMergedSets} datasets={mockDatasets} title="Key Ratios" />);
    expect(screen.getByText("Key Ratios")).toBeInTheDocument();
  });

  it("renders the main BarChart structure", () => {
    render(<WaterfallGraphSmall mergedSets={mockMergedSets} datasets={mockDatasets} title="Key Ratios" />);
    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-grid")).toBeInTheDocument();
    expect(screen.getByTestId("mock-xaxis")).toBeInTheDocument();
    expect(screen.getByTestId("mock-yaxis")).toBeInTheDocument();
  });

  it("renders cells for each data entry", () => {
    render(<WaterfallGraphSmall datasets={mockDatasets} mergedSets={mockMergedSets} title="Key Ratios" />);
    const greenCells = screen.getAllByTestId(/mock-cell-#/); // green shades
    expect(greenCells.length).toBeGreaterThan(0);
  });

  it("renders correctly and matches snapshot", () => {
    const { container } = render(<WaterfallGraphSmall datasets={mockDatasets} mergedSets={mockMergedSets} title="Key Ratios" />);
    expect(container).toMatchSnapshot();
  });
});
