import { useState } from "react";
import WaterfallGraphSmall from "./WaterfallGraphSmall.tsx";
import WaterfallGraphLarge from "./WaterfallGraphLarge.tsx";
import type { Dataset } from "../../Types/Types.tsx";

interface GraphProps {
  datasets: Dataset[]; 
  mergedSets: any[];
  title: String;
  yLabel: String;
  "data-testid"?: string;
}

const WaterfallGraph = ({ datasets, mergedSets, title, yLabel, "data-testid":testid }: GraphProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full" data-testid={testid} data-title={title} data-label={yLabel}>
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