import React from 'react'
import { useState, useEffect} from 'react';
import CovenantsSummarySmall from './CovenantsSummarySmall';
import CovenantsSummaryLarge from './CovenantsSummaryLarge';
import axios from "axios";


interface CategoryProps {
  applicationId : number
}

interface CategoryItem {
    name : string;
    averageSuccess : number;
    spotPercentageSuccess: number;
}

const CovenanatsSummary: React.FC<CategoryProps> = ({applicationId}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);
  const [datasets, setDatasets] = useState<CategoryItem[] | null>(null);
  console.log(`APP ID = ${JSON.stringify(applicationId, null, 2)}`);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          `/api/category?applicationid=${applicationId}`
        );

        const categories: CategoryItem[] = response.data
          .filter((item: any) => item.Category !== "Dividend Payout") // exclude this
          .map((item: any) => ({
            name: item.Category,
            averageSuccess: parseFloat(item["3 yr Average % Success"].toFixed(2)),
            spotPercentageSuccess: parseFloat(item["Spot % Success"].toFixed(2)),
          }));

        console.log("Mapped categories: ", categories);
        setDatasets(categories);
      } catch (err) {
        console.log("error fetching categories in Covenants Summary", err);
      }
    };

    loadData();
  }, [applicationId]);

  useEffect(()=>{
    console.log("dataset" , datasets);
  },[datasets]);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {datasets && datasets.length > 0 ? (
          expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
          <CovenantsSummaryLarge datasets = {datasets} />
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <CovenantsSummarySmall datasets={datasets} />
        </div>
      )
      ) : (
        <div>No data available</div>)}
      
    </div>
  );
};


export default CovenanatsSummary