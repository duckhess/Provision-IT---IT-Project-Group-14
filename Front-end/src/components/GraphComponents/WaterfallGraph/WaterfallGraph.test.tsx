import { render, screen, fireEvent } from "@testing-library/react";
import WaterfallGraph from "./WaterfallGraph";
import * as SmallGraphModule from "./WaterfallGraphSmall";
import * as LargeGraphModule from "./WaterfallGraphLarge";
import type { Dataset } from "../../Types/Types";

const mockDatasets: Dataset[] = [
  {
    name: "Current Ratio",
    data: [
      { x: 2023, y: 3.28 },
      { x: 2024, y: 3.12 },
      { x: 2025, y: 1.93 },
    ],
    metric: "Ratio",
    unit: "Times",
  },
  {
    name: "Quick Ratio (Acid Test)",
    data: [
      { x: 2023, y: 1.87 },
      { x: 2024, y: 1.39 },
      { x: 2025, y: 0.96 },
    ],
    metric: "Ratio",
    unit: "Times",
  },
];

const mockMergedSets = [
  { x: 2023, "Current Ratio": 3.28, "Quick Ratio (Acid Test)": 1.87 },
  { x: 2024, "Current Ratio": 3.12, "Quick Ratio (Acid Test)": 1.39 },
  { x: 2025, "Current Ratio": 1.93, "Quick Ratio (Acid Test)": 0.96 },
];

describe("WaterfallGraph Integration Hybrid Test", () => {
  it("renders WaterfallGraphSmall first, WaterfallGraphLarge after click, and then WaterfallGraphSmall after click", () => {
    // Spy on the child components
    const spySmall = vi.spyOn(SmallGraphModule, "default");
    const spyLarge = vi.spyOn(LargeGraphModule, "default");

    render(
      <WaterfallGraph
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        title="Key Ratios"
        yLabel={mockDatasets[0].unit}
      />
    );

    // Starts with small Waterfall graph first
    expect(spySmall).toHaveBeenCalledTimes(1);
    expect(spyLarge).not.toHaveBeenCalled();

    // Check for large Waterfall graph on click
    fireEvent.click(screen.getByText(/Key Ratios/i));
    expect(spyLarge).toHaveBeenCalledTimes(1);

    // Check small graph Waterfall rerenders after clicking again
    fireEvent.click(screen.getByText(/Key Ratios/i));
    expect(spySmall).toHaveBeenCalledTimes(2);
    expect(spyLarge).toHaveBeenCalledTimes(1);
  });
});
