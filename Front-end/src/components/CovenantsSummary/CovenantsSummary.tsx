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

interface KeyRatio {
  KeyRatioID : number;
  MetricName : string;
  Unit : string;
  ApplicationID : number;
  Timeline : number;
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


// const processData = (keyRatios : KeyRatio[], covenants : Covenant[]) : CategoryItem[] => {

//   // group the covenants based on category in "covenants"
//   const groupCovenants = new Map<string, Covenant[]>();
//   covenants.forEach(c=> {
//      //console.log("[DEBUG] Covenant Category:", c.Category);
//     const catName = c.Category.trim();
//     if(catName === "Dividend Payout"){
//       return;
//     }
//     if(!groupCovenants.has(catName)){
//       groupCovenants.set(catName, []);
//     }
//     groupCovenants.get(catName)!.push(c);
//   });

//   // group the key ratios by metric name 

//   // group key ratios based on category
//   const groupRatio = new Map<string, KeyRatio[]>();
//   keyRatios.forEach(k => {
//     if(!k.Category || !k.MetricName || k.Value === undefined){
//       console.warn("[Debug] skipping invalid key ratio", k);
//       return;
//     }
//     // console.log(`[DEBUG] KeyRatio Category:${k.Category} under ${k.MetricName}` );
//     const catName = k.Category.trim();
//     if(!groupRatio.has(catName)) groupRatio.set(catName,[]);
//     groupRatio.get(catName)!.push(k);
//   })

//   const results : CategoryItem[] = [];

//   groupCovenants.forEach((covList, catName) => {

    
//     // find the average success of each category
//     const avgSuccess = covList.length > 0 
//       ? (covList.filter(c=>c.Analysis).length/covList.length) * 100
//       : 0;


//     const keyRatiosInCategory = groupRatio.get(catName) || [];

//     const metricsMap = new Map<string, KeyRatio[]>();
//     keyRatiosInCategory.forEach(ratio => {
//       if(!metricsMap.has(ratio.MetricName)) metricsMap.set(ratio.MetricName,[]);
//       metricsMap.get(ratio.MetricName)!.push(ratio);
//     })

//     // find the spot % three years
//     let totalMetrics = 0;
//     let passMetrics = 0;

//     metricsMap.forEach((metricList) => {
//       totalMetrics ++;

//       const values = metricList.map(r=>r.Value);
//       let sum = 0;
//       for (let i = 0; i<values.length; i++){
//         sum += values[i];
//       }

//       const avg = sum/values.length;
//       console.log(`avg of the metric is ${avg}`)

//       // time line or period?? remember to check
//       const latestRatio = metricList.find(r => r.Timeline === 2025);

//       console.log(`avg of the metric is ${avg} and latest is $`)
//       if(!latestRatio) return;
//       // console.log(`avg = ${avg} in ${metricList[0].MetricName} and  latestRatio = ${latestRatio.Value}`)
//       if(avg >= latestRatio.Value) passMetrics++;
      
//     });

//     //console.log(`total Metrics in ${catName} = ${totalMetrics} and success = ${passMetrics}`);

//     const spotSuccess = 
//       totalMetrics > 0 ? (passMetrics/totalMetrics) * 100 : 0;

//     console.log(`${catName} has avg : ${avgSuccess} and spot 3 year : ${spotSuccess} `)

//     results.push({
//       name : catName,
//       averageSuccess : avgSuccess,
//       spotPercentageSuccess : spotSuccess,
//     });
//   });

//   return results;
// }

const CovenanatsSummary: React.FC<CategoryProps> = ({applicationId}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);
  const [datasets, setDatasets] = useState<CategoryItem[] | null>(null);

  // useEffect(() => {
  //   const loadData = async () => {
  //     const[keyResponse, covResponse] = await Promise.all([
  //       fetch(`/api/key_ratios?ApplicationID=${applicationId}`),
  //       fetch(`/api/covenants?ApplicationID=${applicationId}`)
  //     ]);

  //     const keyRatiosRes = await keyResponse.json();
  //     const covenantsRes = await covResponse.json();
      
  //     // console.log("key ratio raw reposnse", keyRatiosRes);
  //     // console.log("covenants raw resposne ", covenantsRes);

  //     // this is working 
  //     const keyRatios : KeyRatio[] = Array.isArray(keyRatiosRes) ? keyRatiosRes : [];
  //     const covenants = Array.isArray(covenantsRes) ? (covenantsRes as Covenant[]) : [];

  //     const category = processData(keyRatios, covenants);
  //     setDatasets(category);
  //   };

  //   loadData();
  // }, [applicationId])
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
            averageSuccess: item["3 yr Average % Success"],
            spotPercentageSuccess: item["Spot % Success"],
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