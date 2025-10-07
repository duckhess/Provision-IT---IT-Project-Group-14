import { useState } from "react";
import BarGraphSmall from "./BarGraphSmall.tsx";
import BarGraphLarge from "./BarGraphLarge.tsx";

type Unit = "%" | "$" | "days";
type Metric = "Ratio" | "Revenue" | "Duration";

interface Dataset {
  name: string; // label
  data: { x: number; y: number }[];
  metric: Metric;
  unit: Unit;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  mergedSets: Dataset[];
}

const BarGraph = ({ datasets, mergedSets }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
          <BarGraphLarge datasets={datasets} mergedSets={mergedSets} />
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <BarGraphSmall datasets={datasets} mergedSets={mergedSets} />
        </div>
      )}
    </div>
  );
};

export default BarGraph