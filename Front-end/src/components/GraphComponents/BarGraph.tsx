import { useState } from "react";
import BarGraphSmall from "./BarGraphSmall.tsx";
import BarGraphLarge from "./BarGraphLarge.tsx";
import type { Metric } from "../../Types/Types.tsx";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";


interface Dataset {
  name: string; // label
  data: { x: number; y: number }[];
  metric: Metric;
  unit: Unit;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  mergedSets: Dataset[];
  yLabel: String;
  title:String;
}

const BarGraph = ({ datasets, mergedSets, yLabel, title }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    
    <div className="flex flex-col gap-2 w-full h-full">
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
          <BarGraphLarge datasets={datasets} mergedSets={mergedSets} yLabel={yLabel} title={title} />
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <BarGraphSmall datasets={datasets} mergedSets={mergedSets} yLabel={yLabel} title={title} />
        </div>
      )}
    </div>
  );
};

export default BarGraph