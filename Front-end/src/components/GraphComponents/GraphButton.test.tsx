import { render, screen } from "@testing-library/react";
import { GraphButton } from "./GraphButton";
import type { CompanyDataset } from "../Types/Types";

vi.mock("./DataBox.tsx", () => ({
  default: ({ metric, unit }: any) => (
    <div data-testid="databox">
      <p>{metric}</p>
      <p>{unit}</p>
    </div>
  ),
}));

const mockCompanyDatasets: CompanyDataset[] = [
  {
    company: "CompanyA",
    datasets: [
      { name: "Revenue", metric: "income_statements", unit: "$", data: [] },
      { name: "Profit", metric: "income_statements", unit: "$", data: [] },
      { name: "Liquidity", metric: "covenants", unit: "%", data: [] },
    ],
  },
  {
    company: "CompanyB",
    datasets: [
      { name: "Revenue", metric: "income_statements", unit: "$", data: [] },
      { name: "Liquidity", metric: "covenants", unit: "%", data: [] },
    ],
  },
];

const selectedKeys = [
  "Revenue__income_statements",
  "Profit__income_statements",
  "Liquidity__covenants",
];

describe("GraphButton Component", () => {
  it("renders DataBox components for all selected datasets grouped by metric/unit", () => {
    render(
      <GraphButton
        selectedKeys={selectedKeys}
        companyDatasets={mockCompanyDatasets}
      />
    );

    const boxes = screen.getAllByTestId("databox");
    expect(boxes.length).toBeGreaterThanOrEqual(3);

    // Ensure distinct metrics were passed correctly
    const metrics = boxes.map((b) => b.textContent);
    expect(metrics.join()).toMatch(/income_statements/);
    expect(metrics.join()).toMatch(/covenants/);
  });

  it("renders placeholder DataBox if company has no matching dataset", () => {
    render(
      <GraphButton
        selectedKeys={["Profit__income_statements"]}
        companyDatasets={mockCompanyDatasets}
      />
    );

    // Both companies will have one box each — one real, one placeholder
    const boxes = screen.getAllByTestId("databox");
    expect(boxes.length).toBe(2); 
  });

  it("renders no DataBoxes when no selectedKeys", () => {
    render(
      <GraphButton selectedKeys={[]} companyDatasets={mockCompanyDatasets} />
    );

    expect(screen.queryAllByTestId("databox").length).toBe(0);
  });
});
