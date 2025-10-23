import LineGraph from "./LineGraph/LineGraph.tsx";
import BarGraph from "./BarGraph/BarGraph.tsx";
import WaterfallGraph from "./WaterfallGraph/WaterfallGraph.tsx";
import type { Unit, Dataset } from "../Types/Types.tsx";

interface GraphProps {
  datasets: Dataset[]; 
  unit: Unit;
  title: String;
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

function Graph({ datasets, unit, title }: GraphProps) {
  console.log(datasets);
  const mergedData = mergeDatasets(datasets);

  switch (unit) {
    case "%":
      return (
        <LineGraph datasets={datasets} mergedSets={mergedData} yLabel="%" title={title}></LineGraph>
      );

    case "$":
      return (
        <WaterfallGraph datasets={datasets} mergedSets={mergedData} title={title}></WaterfallGraph>
      );

    case "days":
      return (
        <LineGraph datasets={datasets} mergedSets={mergedData} yLabel="days" title={title}></LineGraph>
      );

    case "Ratio":
      return (
        <BarGraph datasets={datasets} mergedSets={mergedData} yLabel="Ratio" title={title}></BarGraph>
      );
    
    case "Times":
      return (
        <BarGraph datasets={datasets} mergedSets={mergedData} yLabel="×" title={title}></BarGraph>
      );

      case "ratio":
      return (
        <BarGraph datasets={datasets} mergedSets={mergedData} yLabel="Ratio" title={title}></BarGraph>
      );

    default:
      return null;
  }
}

export default Graph;