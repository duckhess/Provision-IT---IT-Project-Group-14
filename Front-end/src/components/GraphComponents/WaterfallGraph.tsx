import { useState } from "react";
import WaterfallGraphSmall from "./WaterfallGraphSmall.tsx";
import WaterfallGraphLarge from "./WaterfallGraphLarge.tsx";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";
type Metric = "Ratio" | "Revenue" | "Duration" | "ABS Benchmark" | "Forecast";

interface Dataset {
  name: string; // label
  data: { x: number; y: number }[];
  metric: Metric;
  unit: Unit;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  mergedSets: Dataset[];
  title: String;
}

const WaterfallGraph = ({ datasets, mergedSets, title }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
          <WaterfallGraphLarge datasets={datasets} mergedSets={mergedSets} title={title} />
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <WaterfallGraphSmall datasets={datasets} mergedSets={mergedSets} title={title}/>
        </div>
      )}
    </div>
  );
};

export default WaterfallGraph