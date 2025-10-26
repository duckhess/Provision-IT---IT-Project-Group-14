import { useState } from "react";
import LineGraphSmall from "./LineGraphSmall";
import LineGraphLarge from "./LineGraphLarge";
import type { Dataset } from "../../Types/Types";

interface GraphProps {
  datasets: Dataset[]; 
  mergedSets: Array<{ [key: string]: number | string }>;
  yLabel: String;
  title: String;
  "data-testid"?: string;
}

const LineGraph = ({ datasets, mergedSets, yLabel, title, "data-testid":testid }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    
    <div className="flex flex-col gap-2 w-full h-full" data-testid={testid} data-title={title} data-label={yLabel}>
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
          <LineGraphLarge datasets={datasets} mergedSets={mergedSets} yLabel={yLabel} title={title} />
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <LineGraphSmall datasets={datasets} mergedSets={mergedSets} yLabel={yLabel} title={title}/>
        </div>
      )}
    </div>
  );
};

export default LineGraph