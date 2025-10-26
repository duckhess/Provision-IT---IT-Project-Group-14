import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Graph, { mergeDatasets } from "./Graph";
import type { Dataset } from "../Types/Types";

// Sample datasets
const sampleDatasets: Dataset[] = [
  {
    name: "Dataset 1",
    metric: "assets",
    unit: "$",
    data: [
      { x: 2021, y: 100 },
      { x: 2022, y: 200 },
    ],
  },
  {
    name: "Dataset 2",
    metric: "Liabilities",
    unit: "$",
    data: [
      { x: 2022, y: 300 },
      { x: 2023, y: 400 },
    ],
  },
];

describe("Graph Component", () => {
  it("mergeDatasets combines x-values correctly", () => {
    const merged = mergeDatasets(sampleDatasets);
    expect(merged).toEqual([
      { x: 2021, "Dataset 1": 100, "Dataset 2": null },
      { x: 2022, "Dataset 1": 200, "Dataset 2": 300 },
      { x: 2023, "Dataset 1": null, "Dataset 2": 400 },
    ]);
  });

  it("renders LineGraph for % and days units", () => {
    const { getAllByTestId } = render(
      <>
        <Graph datasets={sampleDatasets} unit="%" title="Percentage Graph" />
        <Graph datasets={sampleDatasets} unit="days" title="Days Graph" />
      </>
    );

    const lineGraphs = getAllByTestId("line-graph");
    expect(lineGraphs.length).toBe(2);
    expect(lineGraphs[0]).toHaveAttribute("data-label", "%");
    expect(lineGraphs[0]).toHaveAttribute("data-title", "Percentage Graph");
    expect(lineGraphs[1]).toHaveAttribute("data-label", "days");
    expect(lineGraphs[1]).toHaveAttribute("data-title", "Days Graph");
  });

  it("renders WaterfallGraph for $ unit", () => {
    const { getByTestId } = render(
      <Graph datasets={sampleDatasets} unit="$" title="Dollar Graph" />
    );
    const waterfallGraph = getByTestId("waterfall-graph");
    expect(waterfallGraph).toHaveAttribute("data-title", "Dollar Graph");
  });

  it("renders BarGraph for Ratio, ratio, and Times units", () => {
    const { getAllByTestId } = render(
      <>
        <Graph datasets={sampleDatasets} unit="Ratio" title="Ratio Graph" />
        <Graph datasets={sampleDatasets} unit="ratio" title="ratio Graph" />
        <Graph datasets={sampleDatasets} unit="Times" title="Times Graph" />
      </>
    );

    const barGraphs = getAllByTestId("bar-graph");
    expect(barGraphs.length).toBe(3);
    expect(barGraphs[0]).toHaveAttribute("data-label", "Ratio");
    expect(barGraphs[0]).toHaveAttribute("data-title", "Ratio Graph");
    expect(barGraphs[1]).toHaveAttribute("data-label", "Ratio");
    expect(barGraphs[1]).toHaveAttribute("data-title", "ratio Graph");
    expect(barGraphs[2]).toHaveAttribute("data-label", "×");
    expect(barGraphs[2]).toHaveAttribute("data-title", "Times Graph");
  });

});
