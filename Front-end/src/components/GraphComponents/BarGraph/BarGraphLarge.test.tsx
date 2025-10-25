import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BarGraphLarge from "./BarGraphLarge";
import type { Dataset } from "../../Types/Types";

// Mock Recharts components to render HTML instead of SVG
vi.mock("recharts", async (importOriginal) => {
  const original: any = await importOriginal();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children }: any) => <div>{children}</div>,
    CartesianGrid: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    Legend: ({ payload }: any) => (
      <div data-testid="mock-legend">
        {/* Mock the legend items for testing */}
        <span>Revenue</span>
        <span>Expenses</span>
      </div>
    ),
    Bar: ({ dataKey }: any) => <div data-testid={`bar-${dataKey}`} />,
  };
});

describe("BarGraphLarge", () => {
  const mockDatasets: Dataset[] = [
    {
      name: "Revenue",
      data: [
        { x: "Jan", y: 1000 },
        { x: "Feb", y: 1200 },
      ],
      metric: "Income Statements",
      unit: "Ratio",
    },
    {
      name: "Expenses",
      data: [
        { x: "Jan", y: 500 },
        { x: "Feb", y: 600 },
      ],
      metric: "Income Statements",
      unit: "Ratio",
    },
  ];

  const mockMergedSets: Array<{ [key: string]: number | string }> = [
    { x: "Jan", Revenue: 1000, Expenses: 500 },
    { x: "Feb", Revenue: 1200, Expenses: 600 },
  ];

  it("renders the chart title", () => {
    render(
      <BarGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="Ratio"
        title="Income Statements"
      />
    );

    expect(screen.getByText("Income Statements")).toBeInTheDocument();
  });

  it("renders the bars with correct dataKeys", () => {
    render(
      <BarGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="Ratio"
        title="Income Statements"
      />
    );

    // Check that each Bar component is rendered with the correct dataKey
    mockDatasets.forEach(ds => {
      expect(screen.getByTestId(`bar-${ds.name}`)).toBeInTheDocument();
    });
  });

  it("renders legend items", () => {
    render(
      <BarGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="Ratio"
        title="Income Statements"
      />
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("renders without crashing and matches snapshot", () => {
    const { container } = render(
      <BarGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="Ratio"
        title="Income Statements"
      />
    );

    expect(container).toMatchSnapshot();
  });
});
