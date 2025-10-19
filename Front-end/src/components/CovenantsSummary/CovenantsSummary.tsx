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
  Period : number;
  Value : number;
  Category : string;
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
// const groupKeyRatios = (keyRatios : KeyRatio[]) => {
//   const grouped = new Map<string, KeyRatio[]>();

//   keyRatios.forEach(ratio => {
//     if(!grouped.has(ratio.MetricName)){
//       grouped.set(ratio.MetricName, []);
//     }
//     grouped.get(ratio.MetricName)!.push(ratio);
//   });

//   return grouped;
// }

//it would be better if backend has an endpoint derive the high level investor view
const processData = (keyRatios : KeyRatio[], covenants : Covenant[]) : CategoryItem[] => {

  // group the covenants based on category in "covenants"
  const groupCovenants = new Map<string, Covenant[]>();
  covenants.forEach(c=> {
     //console.log("[DEBUG] Covenant Category:", c.Category);
    const catName = c.Category.trim();
    if(!groupCovenants.has(catName)){
      groupCovenants.set(catName, []);
    }
    groupCovenants.get(catName)!.push(c);
  });

  // group the key ratios by metric name 
  //const groupKeyRatiosByName = groupKeyRatios(keyRatios)

  // group key ratios based on category
  const groupRatio = new Map<string, KeyRatio[]>();
  keyRatios.forEach(k => {
    if(!k.Category || !k.MetricName || k.Value === undefined){
      console.warn("[Debug] skipping invalid key ratio", k);
      return;
    }
    // console.log(`[DEBUG] KeyRatio Category:${k.Category} under ${k.MetricName}` );
    const catName = k.Category.trim();
    if(!groupRatio.has(catName)) groupRatio.set(catName,[]);
    groupRatio.get(catName)!.push(k);
  })

  const results : CategoryItem[] = [];

  groupCovenants.forEach((covList, catName) => {

    // find the average success of each category
    const avgSuccess = covList.length > 0 
      ? (covList.filter(c=>c.Analysis).length/covList.length) * 100
      : 0;

    const keyRatiosInCategory = groupRatio.get(catName) || [];

    const metricsMap = new Map<string, KeyRatio[]>();
    keyRatiosInCategory.forEach(ratio => {
      if(!metricsMap.has(ratio.MetricName)) metricsMap.set(ratio.MetricName,[]);
      metricsMap.get(ratio.MetricName)!.push(ratio);
    })

    // find the spot % three years
    let totalMetrics = 0;
    let passMetrics = 0;

    metricsMap.forEach((metricList) => {
      totalMetrics ++;

      const values = metricList.map(r=>r.Value);
      let sum = 0;
      for (let i = 0; i<values.length; i++){
        sum += values[i];
      }

      const avg = sum/values.length;

      

      const latestRatio = metricList.find(r => r.Period === 2025);
      if(!latestRatio) return;
      // console.log(`avg = ${avg} in ${metricList[0].MetricName} and  latestRatio = ${latestRatio.Value}`)
      if(avg >= latestRatio.Value) passMetrics++;
      
    });

      //console.log(`total Metrics in ${catName} = ${totalMetrics} and success = ${passMetrics}`);

    const spotSuccess = 
      totalMetrics > 0 ? (passMetrics/totalMetrics) * 100 : 0;

    results.push({
      name : catName,
      averageSuccess : spotSuccess,
      spotPercentageSuccess : avgSuccess,
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

      // console.log("key ratio : ", keyRatiosRes);
      // console.log("covenants fixed", covenantsRes);

      const keyRatios : KeyRatio[] = Array.isArray(keyRatiosRes) ? keyRatiosRes : [];
      const covenants = Array.isArray(covenantsRes) ? (covenantsRes as Covenant[]) : [];

      // console.log("key ratio fixed : ", keyRatios);
      // console.log("KeyRatios missing category:", keyRatios.filter(k => !k.Category));
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