import { useState } from "react";
import BarGraphSmall from "./BarGraphSmall.tsx";
import BarGraphLarge from "./BarGraphLarge.tsx";
import type { Dataset } from "../../Types/Types.tsx";

interface GraphProps {
  datasets: Dataset[]; 
  mergedSets: Array<{ [key: string]: number | string }>;
  yLabel: String;
  title:String;
  "data-testid"?: string;
}

const BarGraph = ({ datasets, mergedSets, yLabel, title, "data-testid":testid }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    
    <div className="flex flex-col gap-2 w-full h-full" data-testid={testid} data-title={title} data-label={yLabel}>
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