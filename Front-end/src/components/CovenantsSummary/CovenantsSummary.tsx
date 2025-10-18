import React from 'react'
import { useState, useEffect} from 'react';
import CovenantsSummarySmall from './CovenantsSummarySmall';
import CovenantsSummaryLarge from './CovenantsSummaryLarge';


interface CategoryProps {
  applicationId : number
}

interface CategoryItem {
    name : string;
    averageSuccess : number;
    spotPercentageSuccess: number;
}

interface KeyRatio {
  KeyRatioID : number;
  MetricName : string;
  Unit : string;
  ApplicationID : number;
  FileID : number;
  Timeline : string;
  Value : number;
}

interface Covenant {
  CovenantsID : number;
  Metric : string;
  Benchmark : number;
  Category : string;
  Unit : string;
  ApplicationID : number;
  Value : number;
  Comparator : boolean;
  Analysis  : boolean;
}

// grouping the key ratios based on metric
const groupKeyRatios = (keyRatios : KeyRatio[]) => {
  const grouped = new Map<string, KeyRatio[]>();

  keyRatios.forEach(ratio => {
    if(!grouped.has(ratio.MetricName)){
      grouped.set(ratio.MetricName, []);
    }
    grouped.get(ratio.MetricName)!.push(ratio);
  });

  return grouped;
}

//it would be better if backend has an endpoint derive the high level investor view
const processData = (keyRatios : KeyRatio[], covenants : Covenant[]) : CategoryItem[] => {
  // group the metric values based on the metric name from key ratios 
  const groupedRatios = groupKeyRatios(keyRatios);

  // group the covenants based on category in "covenants"
  const groupCategory = new Map<string, Covenant[]>();
  covenants.forEach(c=> {
    if(!groupCategory.has(c.Category)){
      groupCategory.set(c.Category, []);
    }
    groupCategory.get(c.Category)!.push(c);
  });

  // console.log("=== CATEGORY GROUPING CHECK ===");
  // groupCategory.forEach((covList, categoryName) => {
  //   console.log(`Category: ${categoryName}`);
  //   console.log("Metrics in this category:", covList.map(c => c.Metric));
  // });

  const results : CategoryItem[] = [];

  groupCategory.forEach((covList, catName) => {

    // find the average success of each category
    const avgSuccess = (covList.filter(c=>c.Analysis).length/covList.length) * 100;

    // find the spot % three years
    let totalMetrics = 0;
    let passMetrics = 0;

    covList.forEach(cov => {
      const metricData = groupedRatios.get(cov.Metric);
      if(!metricData || metricData.length === 0) return;

      //console.log(`Metric ${cov.Metric} has ${metricData.length} key ratio entries`);

      totalMetrics ++;

      const values = metricData.map(r=>r.Value);
      let sum = 0;
      for (let i = 0; i<values.length; i++){
        sum += values[i];
      }

      const avg = sum / values.length;
      // avg is correct
      console.log(`Metric ${cov.Metric} has ${avg} average and has ${cov.Value} and ${avg > cov.Value}`);

      if(avg > cov.Value) {
        passMetrics ++;
      }
    });

    console.log(`total Metrics in ${catName} = ${totalMetrics} and success = ${passMetrics}`);

    const spotSuccess = 
      totalMetrics > 0 ? (passMetrics/totalMetrics) * 100 : 0;

    results.push({
      name : catName,
      averageSuccess : avgSuccess,
      spotPercentageSuccess : spotSuccess,
    });

  });

  return results;

}

const CovenanatsSummary: React.FC<CategoryProps> = ({applicationId}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);
  const [datasets, setDatasets] = useState<CategoryItem[] | null>(null);

  

  useEffect(() => {
    const loadData = async () => {
      const[keyResponse, covResponse] = await Promise.all([
        fetch(`/api/key_ratios?ApplicationID=${applicationId}`),
        fetch(`/api/covenants?ApplicationID=${applicationId}`)
      ]);

      const keyRatiosRes = await keyResponse.json();
      const covenantsRes = await covResponse.json();

      const keyRatios : KeyRatio[] = Array.isArray(keyRatiosRes) ? keyRatiosRes : [];
      const covenants = Array.isArray(covenantsRes) ? (covenantsRes as Covenant[]) : [];

      // console.log("key ratio fixed : ", keyRatios);
      // console.log("covenants fixed", covenants);

      const category = processData(keyRatios, covenants);
      setDatasets(category);
    };

    loadData();
  }, [applicationId])

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