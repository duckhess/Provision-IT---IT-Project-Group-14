import DataBox from "./DataBox.tsx";
import type { Metric } from "./Types/Types.tsx";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";


interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
  // section: Section;
}

interface GraphContainerProps {
  selectedDatasets: Dataset[];
}

export function GraphButton({ selectedDatasets }: GraphContainerProps) {
  // Group by metric+unit
  // Record as a (Metric_Unit): Dataset[]
  const groupedData = selectedDatasets.reduce<Record<string, Dataset[]>>((acc, ds) => {
    // const key = `${ds.metric}_${ds.unit}_${ds.section}`;
    const key = `${ds.metric}_${ds.unit}`;

    // Puts the dataset into the appropriate group with a (Metric_Unit) key.
    if (!acc[key]) acc[key] = [];
    acc[key].push(ds);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 gap-4 items-stretch h-full">

      {/* Gets an array of key(metric_unit) value(dataset of that metric, unit combination) pairs */}
      {Object.entries(groupedData).flatMap(([key, datasets]) => {

        // split into chunks of 4
        const chunks: Dataset[][] = [];
        for (let i = 0; i < datasets.length; i += 4) {
          chunks.push(datasets.slice(i, i + 4));
        }

        const unit = datasets[0].unit;
        const metric = datasets[0].metric;

        // Create a graph of maximum four dataset in each graph for each key-value pair
        return chunks.map((chunk, i) => (
          <DataBox key={`${key}_${i}`} datasets={chunk} unit={unit} metric={metric}/>
        ));
      })}
    </div>
  );
}