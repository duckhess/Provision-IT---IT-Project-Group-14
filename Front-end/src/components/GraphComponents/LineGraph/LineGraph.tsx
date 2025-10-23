import { useState } from "react";
import LineGraphSmall from "./LineGraphSmall";
import LineGraphLarge from "./LineGraphLarge";
import type { Dataset } from "../../Types/Types";

interface GraphProps {
  datasets: Dataset[]; 
  mergedSets: Dataset[];
  yLabel: String;
  title: String;
}

const LineGraph = ({ datasets, mergedSets, yLabel, title }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    
    <div className="flex flex-col gap-2 w-full h-full">
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