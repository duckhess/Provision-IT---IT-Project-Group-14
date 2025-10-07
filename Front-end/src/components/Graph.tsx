import LineGraph from "./GraphComponents/LineGraph";
import BarGraph from "./GraphComponents/BarGraph";
import WaterfallGraph from "./GraphComponents/WaterfallGraph";

type Unit = "%" | "$" | "days" | "Ratio" | "Times";
type Metric = "Ratio" | "Revenue" | "Duration";

interface Dataset {
  name: string; // label
  data: { x: number; y: number }[];
  metric: Metric;
  unit: Unit;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  unit: Unit;
}

// Combine charts (An x-value maps to each dataset's y-value)
function mergeDatasets(datasets: Dataset[]) {
  // Collect all possible unique x values
  const allX = Array.from(
    // Extracts each x values, flattens it into an array, and removes duplicates
    new Set(datasets.flatMap((ds) => ds.data.map((d) => d.x)))
  ).sort((a, b) => a - b);

  // Build merged rows
  return allX.map((x) => {
    const row: any = { x };

    // For each dataset, find if it has a datapoint for each particular x.
    // If it does, store the y value under that dataset's name.
    datasets.forEach((ds) => {

      // Search if the dataset has data for a particular x-value.
      const point = ds.data.find((p) => p.x === x);

      // Store y-value if it exists
      row[ds.name] = point ? point.y : null;
    });
    return row;
  });
}

function Graph({ datasets, unit }: GraphProps) {
  const mergedData = mergeDatasets(datasets);

  switch (unit) {
    case "%":
      return (
        <LineGraph datasets={datasets} mergedSets={mergedData}></LineGraph>
      );

    case "$":
      return (
        <WaterfallGraph datasets={datasets} mergedSets={mergedData}></WaterfallGraph>
      );

    case "days":
      return (
        <LineGraph datasets={datasets} mergedSets={mergedData}></LineGraph>
      );

    case "Ratio":
      return (
        <BarGraph datasets={datasets} mergedSets={mergedData}></BarGraph>
      );
    
    case "Times":
      return (
        <BarGraph datasets={datasets} mergedSets={mergedData}></BarGraph>
      );

    default:
      return null;
  }
}

export default Graph;