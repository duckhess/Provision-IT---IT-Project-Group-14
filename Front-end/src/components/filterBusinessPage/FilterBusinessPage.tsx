// import { useState, useEffect } from 'react';
// import SideBarFilterButton from './sideBar/SideBarFilterButton';
// import SidebarFilter from './sideBar/SidebarFilter';
// import { GraphButton } from '../GraphButton';
// import type { Metric } from '../Types/Types';
// import axios from "axios";

// // ------------------------------
// // Types
// // ------------------------------

// type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

// const endpoints = [
//   "abs_benchmarkings",
//   "assets",
//   "liabilities",
//   "income_statements",
//   "equities",
//   "financial_statements",
//   "key_ratios",
//   "working_capital_movements",
//   "forecasts",
//   "cash_equivalences",
//   "covenants",
// ];

// interface Dataset {
//   name: string;
//   data: any[];
//   metric: Metric;
//   unit: Unit;
//   metadata?: Record<string, any>;
// }

// interface Company {
//   companyId: number;
//   companyName: string;
//   datasets?: Dataset[];
// }

// interface CompanyDataset {
//   company: string;
//   datasets: Dataset[];
// }

// interface FilterBusinessPageProps {
//   companyA: Company | null;
// }

// interface CovenantMetricItem {
//   name: string;
//   pass: boolean;
//   calc_value: number;
//   abs_value: number;
// }

// interface CovenantDataset extends Dataset {
//   data: CovenantMetricItem[][];
//   metadata?: {
//     threeYearAvgSuccess: number;
//   };
// }

// /* -------------------- TRANSFORMS -------------------- */

// const transformABSBenchmarking = (data: any[]): Dataset[] => [
//   {
//     name: "ABS Benchmarking",
//     metric: "ABS Benchmarking",
//     unit: data[0]?.Unit ?? "Benchmark",
//     data: data.map((item) => ({
//       name: item.Benchmark,
//       pass: item.Analysis,
//       calc_value: item.CalcValue,
//       abs_value: item.ABSValue,
//       greater: item.Analysis
//         ? item.CalcValue > item.ABSValue
//         : item.CalcValue < item.ABSValue,
//     })),
//     metadata: {
//       ANZICCode: data[0]?.ANZICCode ?? null,
//       field: data[0]?.Field ?? null,
//     },
//   },
// ];

// const transformTimelineMetricsPerCompany = (
//   endpoint: string,
//   rawData: any[]
// ): Dataset[] => {
//   if (!rawData || rawData.length === 0) return [];

//   const idKey =
//     Object.keys(rawData[0]).find((k) => k.endsWith("ID")) ?? "ID";

//   const grouped: Record<string | number, any[]> = {};
//   rawData.forEach((item) => {
//     const id = item[idKey];
//     if (!grouped[id]) grouped[id] = [];
//     grouped[id].push(item);
//   });

// return Object.values(grouped).map((items) => {
//     const first = items[0];

//     // Try to detect possible x/y field names automatically
//     const xKey = ["Timeline", "Period", "Year", "Date"].find((k) => k in first) ?? "Period";
//     const yKey = ["Value", "Amount", "Balance", "Val"].find((k) => k in first) ?? "Value";

//     const data = items.map((d) => ({
//       x: Number(d[xKey]),
//       y: Number(d[yKey]),
//     }));

//     return {
//       name: first.MetricName ??
//     first.Metric ??
//     first.AccountDescription ?? // ✅ correct key
//     first.accountDescription ?? // ✅ lowercase variant, just in case
//     endpoint,
//       metric: endpoint as Metric,
//       unit: first.Unit as Unit,
//       data,
//     };
//   });
// };

// const transformTimelineForecastMetrics = (
//   rawData: any[],
//   companyId: number,
//   metricCategory: Metric,
//   idField: string
// ): Dataset[] => {
//   const applicationId =
//     companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

//   const filtered = rawData.filter(
//     (item) => item.ApplicationID === applicationId
//   );
//   if (filtered.length === 0) return [];

//   const grouped: Record<number, any[]> = {};
//   filtered.forEach((item) => {
//     if (!grouped[item[idField]]) grouped[item[idField]] = [];
//     grouped[item[idField]].push(item);
//   });

//   return Object.values(grouped).map((items) => {
//     const first = items[0];

//     // Safely handle both “Avg Historical Forecast” and “Avg Hist Forecast”
//     const avgHistoricalForecast =
//       first["Avg Historical Forecast"] ??
//       first["Avg Hist Forecast"] ??
//       null;

//     return {
//       name: first.AccountDescription ?? first.Metric ?? "Unknown",
//       metric: metricCategory,
//       unit: first.Unit as Unit,
//       data: [
//         { x: "Avg Historical Forecast", y: avgHistoricalForecast },
//         { x: "User Forecast", y: first["User Forecast"] },
//       ],
//   };
//  });
// };

// /* -------------------- COVENANTS -------------------- */

// const transformCovenants = (
//   covenantsRaw: any[],
//   keyRatios: Dataset[]
// ): CovenantDataset[] => {
//   const groupedByCategory: Record<string, any[]> = {};
//   covenantsRaw.forEach(item => {
//     const category = item.Category ?? "Uncategorized";
//     if (!groupedByCategory[category]) groupedByCategory[category] = [];
//     groupedByCategory[category].push(item);
//   });

//   return Object.entries(groupedByCategory).map(([category, items]) => {
//     const metricList = items.map(item => ({
//       name: item.Metric,
//       pass: item.Analysis,
//       calc_value: Number(item.Value),
//       abs_value: item.Benchmark,
//     }));

//     // Calculate threeYearAvgSuccess
//     let passCount = 0;
//     metricList.forEach(metric => {
//       if (!metric.name) return; // skip if metric name is undefined/null
//       const kr = keyRatios.find(k => {
//         if (!k.name) return false; // skip if key ratio name is undefined
//         return k.name.trim().toLowerCase() === metric.name.trim().toLowerCase();
//       });
//       if (kr && kr.data.length > 0) {
//         const avg =
//           kr.data.reduce((sum, d) => sum + d.y, 0) / kr.data.length;
//         const latest = kr.data[kr.data.length - 1].y;
//         if (avg > latest) passCount += 1;
//       }
//     });

//     const threeYearAvgSuccess =
//       metricList.length > 0 ? (passCount / metricList.length) * 100 : 0;

//     return {
//       name: category,
//       metric: "covenants" as Metric,
//       unit: category as Unit,
//       data: [metricList],
//       metadata: { threeYearAvgSuccess },
//     };
//   });
// };

// /* -------------------- FETCH -------------------- */

// const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
//   try {
//     const applicationId =
//       companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

//     const requests = endpoints.map((endpoint) =>
//       axios.get(`/api/${endpoint}?applicationID=${applicationId}`)
//     );
//     const responses = await Promise.all(requests);

//     // Extract key_ratios for use in covenants
//     const keyRatiosRes = responses.find((_, i) => endpoints[i] === "key_ratios");
//     const keyRatios = keyRatiosRes?.data ?? [];

//     const datasets: Dataset[] = [];

//     for (let i = 0; i < responses.length; i++) {
//       const endpoint = endpoints[i];
//       const data = responses[i].data;
//       if (!data || data.length === 0) continue;

//       switch (endpoint) {
//         case "abs_benchmarkings":
//           datasets.push(...transformABSBenchmarking(data));
//           break;
//         case "forecasts":
//           datasets.push(
//             ...transformTimelineForecastMetrics(data, companyId, "Forecast", "ForecastID")
//           );
//           break;
//         case "working_capital_movements":
//           datasets.push(
//             ...transformTimelineForecastMetrics(data, companyId, "working_capital_movements", "CapitalID")
//           );
//           break;
//         case "covenants":
//           datasets.push(...transformCovenants(data, keyRatios));
//           break;
//         default:
//           datasets.push(...transformTimelineMetricsPerCompany(endpoint, data));
//           break;
//       }
//     }

//     return datasets;
//   } catch (err) {
//     console.error(`Error fetching datasets for company ${companyId}:`, err);
//     return [];
//   }
// };



// // dont change anything here, this is working good 
// const FilterBusinessPage : React.FC<FilterBusinessPageProps> = ({companyA}) => {
//   const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
//   const [selectedDataSets, setSelectedDataSets] = useState<Dataset[]>([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [companyMetric, setCompanyMetric] = useState<Company | null>(null);
//   const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async() => {
//       setLoading(true);
//       try {
//         if(companyA?.companyId){
//           const dataSetsA = await fetchCompanyDatasets(companyA.companyId);
//           setCompanyMetric({...companyA, datasets: dataSetsA});
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [companyA]);

//   useEffect(() => {
//     console.log("selected data sets: ", companyMetric);
//   })

//   const companyDatasets : CompanyDataset[] = [{
//     company : companyMetric?.companyName ?? "Company A",
//     datasets : companyMetric?.datasets ?? [],
//   }]

//   useEffect(() => {
//     console.log("selected data sets: ", companyDatasets);
//   })

//   const allDatasets: Dataset[] = [];
//   const seen = new Set<string>();

//   console.log("CompanyDatasets Raw:", companyDatasets);
//   companyDatasets.forEach(({ datasets }) => {
//     datasets.forEach((ds) => {
//     const cleanName = ds.name?.trim().toLowerCase(); // normalize
//     if (!cleanName) return; // skip undefined or empty names

//       if (!seen.has(cleanName)) {
//         allDatasets.push({
//           name: ds.name,
//           metric: ds.metric,
//           unit: ds.unit,
//           data: [],
//         });
//         seen.add(ds.name);
//       }
//     });
//   });


//   const handleToggleSelection = (key: string) => {
//     setSelectedKeys((prev) =>
//       prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
//     );
//   };

//   const handleGenerate = () => {
//     setFinalSelectedKeys(selectedKeys);
//     setSidebarOpen(false);
//   };

//   // const handleGenerate = () => {
//   //   const selected = dummyData.filter((d) => selectedKeys.includes(d.name));
//   //   setSelectedDataSets(selected);
//   //   setSidebarOpen(false);
//   // };

//   console.log("company datasets ", companyDatasets);
//   console.log("")

//   return (
//     <div className="grid grid-rows-[35px]">
//       <div>
//         <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />

//       {sidebarOpen && (
//         <SidebarFilter
//           onClose={handleGenerate}
//           datasets={allDatasets} // simplified: just pass all dataset names
//           selectedKeys={selectedKeys}
//           toggleSelection={handleToggleSelection}
//         />
//       )}
//       </div>
      
//       <div className="flex-1 p-4">
//         {finalSelectedKeys.length > 0 && companyA  && (

//           <GraphButton
//             selectedKeys={finalSelectedKeys}
//             companyDatasets={companyDatasets}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterBusinessPage;

import { useState, useEffect } from "react";
import { CompareGraphButton } from "../ComparisonPageComponents/CompareGraphButton.tsx";
import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";
import type { Metric, Dataset, Unit } from "../Types/Types.tsx";
import axios from "axios";

/* -------------------- ENDPOINTS -------------------- */
const endpoints = [
  "abs_benchmarkings",
  "assets",
  "liabilities",
  "income_statements",
  "equities",
  "financial_statements",
  "key_ratios",
  "working_capital_movements",
  "forecasts",
  "cash_equivalences",
  "covenants",
];

/* -------------------- TYPES -------------------- */
interface Company {
  companyId: number;
  companyName: string;
  datasets?: Dataset[];
}

interface CompanyDataset {
  company: string;
  datasets: Dataset[];
}

interface FilterComparisonPageProps {
  companyA: Company | null;
  companyB: Company | null;
}

/* -------------------- TRANSFORMS -------------------- */
const transformEGS = (data: { EnvironmentalScore: number; SocialScore: number }[]): Dataset[] => {
  if (!data || data.length === 0) return [];

  const first = data[0]; // Take the first item (or loop if needed)

  return [
    {
      name: "Environmental Score",
      metric: "Ratio",
      unit: "%",
      data: [{ x: "Score", y: first.EnvironmentalScore }],
    },
    {
      name: "Social Score",
      metric: "Ratio",
      unit: "%",
      data: [{ x: "Score", y: first.SocialScore }],
    },
  ];
};

const transformCovenants = (data: any[]): Dataset[] =>
  data.map((item) => ({
    name: item.Metric,
    metric: "covenants",
    unit: "%",
    data: [{ x: "Pass", y: item.Analysis ? 1 : 0 }],
  }));

const transformTimelineMetricsPerCompany = (
  endpoint: string,
  rawData: any[]
): Dataset[] => {
  if (!rawData || rawData.length === 0) return [];
  const idKey = Object.keys(rawData[0]).find((k) => k.endsWith("ID")) ?? "ID";

  const grouped: Record<string | number, any[]> = {};
  rawData.forEach((item) => {
    const id = item[idKey];
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(item);
  });

  return Object.values(grouped).map((items) => ({
    name:
      items[0].MetricName ?? items[0].AccountDescription ?? items[0].name ?? endpoint,
    metric: endpoint as Metric,
    unit: items[0].Unit as Unit,
    data: items.map((d) => ({ x: d.Timeline, y: d.Value })),
  }));
};

/* -------------------- FETCH DATA -------------------- */
const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
  try {
    const requests = endpoints.map((endpoint) =>
      axios.get(`/api/${endpoint}?applicationID=${companyId}`)
    );
    const responses = await Promise.all(requests);

    let datasets: Dataset[] = [];

    for (let i = 0; i < responses.length; i++) {
      const endpoint = endpoints[i];
      const data = responses[i].data;
      if (!data || data.length === 0) continue;

      switch (endpoint) {
        case "covenants":
          datasets.push(...transformCovenants(data));
          break;
        default:
          datasets.push(...transformTimelineMetricsPerCompany(endpoint, data));
          break;
      }
    }

    // Fetch EGS separately
    try {
      const egsRes = await axios.get(`/api/company_data?CompanyID=${companyId}`);
      if (egsRes.data && egsRes.data.length > 0) {
        datasets.push(...transformEGS(egsRes.data[0]));
      }
    } catch (err) {
      console.warn("Failed to fetch EGS data", err);
    }

    return datasets;
  } catch (err) {
    console.error(`Error fetching datasets for company ${companyId}:`, err);
    return [];
  }
};

/* -------------------- COMPONENT -------------------- */
const FilterComparisonPage: React.FC<FilterComparisonPageProps> = ({
  companyA,
  companyB,
}) => {
  const [companyAMetric, setCompanyAMetric] = useState<Company | null>(null);
  const [companyBMetric, setCompanyBMetric] = useState<Company | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (companyA?.companyId) {
        const datasetsA = await fetchCompanyDatasets(companyA.companyId);
        setCompanyAMetric({ ...companyA, datasets: datasetsA });
      }
      if (companyB?.companyId) {
        const datasetsB = await fetchCompanyDatasets(companyB.companyId);
        setCompanyBMetric({ ...companyB, datasets: datasetsB });
      }
    };
    fetchData();
  }, [companyA, companyB]);

  const companyDatasets: CompanyDataset[] = [
    {
      company: companyA?.companyName ?? "Company A",
      datasets: companyAMetric?.datasets ?? [],
    },
    {
      company: companyB?.companyName ?? "Company B",
      datasets: companyBMetric?.datasets ?? [],
    },
  ];

  // Build sidebar dataset list with unique keys
  const allDatasets: (Dataset & { uniqueKey: string })[] = [];
  const seen = new Set<string>();
  companyDatasets.forEach(({ datasets }) => {
    datasets.forEach((ds) => {
      const uniqueKey = `${ds.name}__${ds.metric}`;
      if (!seen.has(uniqueKey)) {
        allDatasets.push({ ...ds, uniqueKey });
        seen.add(uniqueKey);
      }
    });
  });

  const handleToggleSelection = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    setFinalSelectedKeys(selectedKeys);
    setSidebarOpen(false);
  };

  return (
    <div className="flex">
      <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />
      {sidebarOpen && (
        <SidebarFilter
          onClose={handleGenerate}
          datasets={allDatasets}
          selectedKeys={selectedKeys}
          toggleSelection={handleToggleSelection}
        />
      )}

      <div className="flex-1 p-4">
        {finalSelectedKeys.length > 0 && companyA && companyB && (
          <CompareGraphButton
            selectedKeys={finalSelectedKeys.map((key) => key.split("__")[0])} // use name
            companyDatasets={companyDatasets}
          />
        )}
      </div>
    </div>
  );
};

export default FilterComparisonPage;
