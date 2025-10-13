import DataBox from "./DataBox";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";
type Metric = "Ratio" | "Revenue" | "Duration" | "ABS Benchmark" | "Forecast";
type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
  section: Section;
}

interface GraphContainerProps {
  selectedDatasets: Dataset[];
}

function SearchPageGrid({ selectedDatasets }: GraphContainerProps) {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 items-stretch h-full">
      {selectedDatasets.map((dataset, i) => (
        <div className="overflow-y-auto">
        <DataBox
          key={i}
          datasets={[dataset]} // array of 1 element
          unit={dataset.unit}
          section={dataset.section}
        />
        </div>
      ))}
    </div>
  );
}

export default SearchPageGrid;