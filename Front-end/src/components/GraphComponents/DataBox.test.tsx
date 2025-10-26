import { render, screen } from "@testing-library/react";
import DataBox from "./DataBox";
import type { Dataset } from "../Types/Types";
import { vi } from "vitest";

vi.mock("./Graph.tsx", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="Graph">Graph Rendered: {title}</div>
  ),
}));

vi.mock("./Covenants/Covenants.tsx", () => ({
  __esModule: true,
  default: ({ category }: { category: string }) => (
    <div data-testid="Covenants">Covenants Category: {category}</div>
  ),
}));

vi.mock("./EGSScore/EGSScore.tsx", () => ({
  __esModule: true,
  default: ({ environment, social, governance }: any) => (
    <div data-testid="EGSScore">
      ESG: E={environment}, S={social}, G={governance}
    </div>
  ),
}));

vi.mock("./CovenantsSummary/CovenantsSummary.tsx", () => ({
  __esModule: true,
  default: ({ applicationId }: { applicationId: number }) => (
    <div data-testid="CovenantSummary">Summary ID: {applicationId}</div>
  ),
}));

const graphDataset: Dataset[] = [
  {
    name: "Revenue",
    metric: "income_statements",
    unit: "$",
    data: [
      { x: "2021", y: 1000 },
      { x: "2022", y: 1500 },
    ],
  },
];

const covenantsDataset: Dataset[] = [
  {
    name: "Covenants Category",
    metric: "covenants",
    unit: "%",
    data: [[
      { name: "Metric 1", pass: true, calc_value: 90, abs_value: 85 },
      { name: "Metric 2", pass: false, calc_value: 60, abs_value: 50 },
    ]],
    metadata: {
      threeYearAvgSuccess: 80,
    },
  },
];

const egsDataset: Dataset[] = [
  {
    name: "EGS Score",
    metric: "EGS",
    unit: "$",
    data: [
      { x: "Environmental", y: 70 },
      { x: "Social", y: 80 },
      { x: "Governance", y: 90 },
    ],
  },
];

const covenantSummaryDataset: Dataset[] = [
  {
    name: "Covenant Summary",
    metric: "Covenant Summary",
    unit: "%",
    data: [1],
  },
];

describe("DataBox Component", () => {
  it("renders Graph component for metrics that use Graph", () => {
    render(
      <DataBox
        datasets={graphDataset}
        unit={graphDataset[0].unit}
        metric={graphDataset[0].metric}
      />
    );
    expect(screen.getByTestId("Graph")).toHaveTextContent(/income_statements/i);
  });

  it("renders Covenants component for 'covenants' metric", () => {
    render(
      <DataBox
        datasets={covenantsDataset}
        unit={covenantsDataset[0].unit}
        metric={covenantsDataset[0].metric}
      />
    );
    expect(screen.getByTestId("Covenants")).toHaveTextContent(
      /Covenants Category/i
    );
  });

  it("renders EGSScore component for 'EGS' metric", () => {
    render(
      <DataBox
        datasets={egsDataset}
        unit={egsDataset[0].unit}
        metric={egsDataset[0].metric}
      />
    );
    expect(screen.getByTestId("EGSScore")).toHaveTextContent(/E=70/i);
    expect(screen.getByTestId("EGSScore")).toHaveTextContent(/S=80/i);
    expect(screen.getByTestId("EGSScore")).toHaveTextContent(/G=90/i);
  });

  it("renders CovenantSummary component for 'Covenant Summary' metric", () => {
    render(
      <DataBox
        datasets={covenantSummaryDataset}
        unit={covenantSummaryDataset[0].unit}
        metric={covenantSummaryDataset[0].metric}
      />
    );
    expect(screen.getByTestId("CovenantSummary")).toHaveTextContent(/1/i);
  });
});
