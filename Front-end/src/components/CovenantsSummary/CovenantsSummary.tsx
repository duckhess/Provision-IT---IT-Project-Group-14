import React from 'react'
import { useState } from 'react';
import CovenantsSummarySmall from './CovenantsSummarySmall';
import CovenantsSummaryLarge from './CovenantsSummaryLarge';

interface CategoryItem {
    name : string;
    averageSuccess : number;
    spotPercentageSuccess: number;
}

interface CategoryProps {
    datasets : CategoryItem[];
}

const CovenanatsSummary: React.FC<CategoryProps> = ({datasets}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
          <CovenantsSummaryLarge datasets = {datasets} />
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <CovenantsSummarySmall datasets={datasets} />
        </div>
      )}
    </div>
  );
};


export default CovenanatsSummary