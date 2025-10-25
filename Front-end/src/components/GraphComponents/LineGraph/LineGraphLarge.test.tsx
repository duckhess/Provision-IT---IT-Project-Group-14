import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LineGraphLarge from "./LineGraphLarge";
import type { Dataset } from "../../Types/Types";

// 🔹 Local array used to collect <Line> props
const renderedLines: any[] = [];

// --- Mock Recharts components --- //
vi.mock("recharts", async (importOriginal) => {
  const original: any = await importOriginal();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: ({ children }: any) => <div>{children}</div>,
    CartesianGrid: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    Legend: () => (
      <div data-testid="mock-legend">
        <span>Operating Cycle</span>
        <span>Quick Ratio (Acid Test)</span>
      </div>
    ),
    Line: (props: any) => {
      renderedLines.push(props);
      return <div data-testid={`line-${props.dataKey}`} />;
    },
  };
});

describe("LineGraphLarge", () => {
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

  beforeEach(() => {
    renderedLines.length = 0; // reset mock data before each test
  });

  it("renders the chart title", () => {
    render(
      <LineGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="days"
        title="Key Ratios"
      />
    );

    expect(screen.getByText("Key Ratios")).toBeInTheDocument();
  });

  it("renders a line for each dataset with correct dataKeys", () => {
    render(
      <LineGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="days"
        title="Key Ratios"
      />
    );

    const renderedKeys = renderedLines.map((line) => line.dataKey);
    const expectedKeys = mockDatasets.map((ds) => ds.name);

    expect(renderedKeys).toEqual(expectedKeys);

    mockDatasets.forEach((ds) => {
      expect(screen.getByTestId(`line-${ds.name}`)).toBeInTheDocument();
    });
  });

  it("renders legend items", () => {
    render(
      <LineGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="days"
        title="Key Ratios"
      />
    );

    expect(screen.getByText("Operating Cycle")).toBeInTheDocument();
    expect(screen.getByText("Quick Ratio (Acid Test)")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <LineGraphLarge
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="days"
        title="Key Ratios"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
