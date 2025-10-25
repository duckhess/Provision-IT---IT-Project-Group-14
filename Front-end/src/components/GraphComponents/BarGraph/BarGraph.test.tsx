import { render, screen, fireEvent } from "@testing-library/react";
import BarGraph from "./BarGraph";
import * as SmallGraphModule from "./BarGraphSmall";
import * as LargeGraphModule from "./BarGraphLarge";
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

describe("BarGraph Integration Hybrid Test", () => {
  it("renders BarGraphSmall first, BarGraphLarge after click, and then BarGraphSmall after click", () => {
    // Spy on the child components
    const spySmall = vi.spyOn(SmallGraphModule, "default");
    const spyLarge = vi.spyOn(LargeGraphModule, "default");

    render(
      <BarGraph
        datasets={mockDatasets}
        mergedSets={mockMergedSets}
        yLabel="Times"
        title="Key Ratios"
      />
    );

    // Starts with small bar graph first
    expect(spySmall).toHaveBeenCalledTimes(1);
    expect(spyLarge).not.toHaveBeenCalled();

    // Check for large bar graph on click
    fireEvent.click(screen.getByText(/Key Ratios/i));
    expect(spyLarge).toHaveBeenCalledTimes(1);

    // Check small graph bar rerenders after clicking again
    fireEvent.click(screen.getByText(/Key Ratios/i));
    expect(spySmall).toHaveBeenCalledTimes(2);
    expect(spyLarge).toHaveBeenCalledTimes(1);
  });
});
