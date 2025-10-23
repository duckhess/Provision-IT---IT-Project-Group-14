import { useState, useEffect } from "react";
import { GraphButton } from "../GraphComponents/GraphButton.tsx";
import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";
import type { Metric, Unit, Dataset } from "../Types/Types.tsx";
import axios from "axios";

const endpoints = [
  "company_data",
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

interface CovenantMetricItem {
  name: string;
  pass: boolean;
  calc_value: number;
  abs_value: number;
}

interface CovenantDataset extends Dataset {
  data: CovenantMetricItem[][];
  metadata?: {
    threeYearAvgSuccess: number;
  };
}

/* -------------------- TRANSFORMS -------------------- */

const transformABSBenchmarking = (data: any[]): Dataset[] => [
  {
    name: "ABS Benchmarking",
    metric: "ABS Benchmarking",
    unit: data[0]?.Unit ?? "Benchmark",
    data: data.map((item) => ({
      name: item.Benchmark,
      pass: item.Analysis,
      calc_value: item.CalcValue,
      abs_value: item.ABSValue,
      greater: item.Analysis
        ? item.CalcValue > item.ABSValue
        : item.CalcValue < item.ABSValue,
    })),
    metadata: {
      ANZICCode: data[0]?.ANZICCode ?? null,
      field: data[0]?.Field ?? null,
    },
  },
];

const transformTimelineMetricsPerCompany = (
  endpoint: string,
  rawData: any[]
): Dataset[] => {
  if (!rawData || rawData.length === 0) return [];

  const idKey =
    Object.keys(rawData[0]).find((k) => k.endsWith("ID")) ?? "ID";

  const grouped: Record<string | number, any[]> = {};
  rawData.forEach((item) => {
    const id = item[idKey];
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(item);
  });

  return Object.values(grouped).map((items) => ({
    name: items[0].MetricName ?? items[0].AccountDescription ?? items[0].name ?? endpoint,
    metric: endpoint as Metric,
    unit: items[0].Unit as Unit,
    data: items.map((d) => ({
      x: Number(d.Timeline),
      y: Number(d.Value),
    })),
  }));
};

const transformTimelineForecastMetrics = (
  rawData: any[],
  companyId: number,
  metricCategory: Metric,
  idField: string
): Dataset[] => {
  const applicationId =
    companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

  const filtered = rawData.filter(
    (item) => item.ApplicationID === applicationId
  );
  if (filtered.length === 0) return [];

  const grouped: Record<number, any[]> = {};
  filtered.forEach((item) => {
    if (!grouped[item[idField]]) grouped[item[idField]] = [];
    grouped[item[idField]].push(item);
  });

  return Object.values(grouped).map((items) => {
    const first = items[0];
    const finalName = first.AccountDescription ?? first.MetricName ?? "Unknown";
    return {
      name: finalName,
      metric: metricCategory,
      unit: first.Unit as Unit,
      data: [
        { x: "Avg Hist Forecast", y: first["Avg Hist Forecast"] },
        { x: "User Forecast", y: first["User Forecast"] },
      ],
    };
  });
};

/* -------------------- COVENANTS -------------------- */

const transformCovenants = (
  covenantsRaw: any[],
  keyRatios: Dataset[]
): CovenantDataset[] => {
  const groupedByCategory: Record<string, any[]> = {};
  covenantsRaw.forEach((item) => {
    const category = item.Category ?? "Uncategorized";
    if (!groupedByCategory[category]) groupedByCategory[category] = [];
    groupedByCategory[category].push(item);
  });

  return Object.entries(groupedByCategory).map(([category, items]) => {
    const metricList = items.map((item) => ({
      name: item.Metric,
      pass: item.Analysis,
      calc_value: Number(item.Value),
      abs_value: item.Benchmark,
    }));

    let passCount = 0;
    metricList.forEach((metric) => {
      if (!metric.name) return;
      const kr = keyRatios.find(
        (k) =>
          k.name &&
          k.name.trim().toLowerCase() === metric.name.trim().toLowerCase()
      );
      if (kr && kr.data.length > 0) {
        const avg =
          kr.data.reduce((sum, d) => sum + d.y, 0) / kr.data.length;
        const latest = kr.data[kr.data.length - 1].y;
        if (avg > latest) passCount += 1;
      }
    });

    const threeYearAvgSuccess =
      metricList.length > 0 ? (passCount / metricList.length) * 100 : 0;

    return {
      name: category,
      metric: "covenants",
      unit: category as Unit,
      data: [metricList],
      metadata: { threeYearAvgSuccess },
    };
  });
};

/* -------------------- ESG -------------------- */

const transformEGS = (companyData: any[]): Dataset[] => {
  if (!companyData || companyData.length === 0) return [];
  const first = companyData[0];
  return [
  {
    name: "EGS Score",  
    metric: "EGS",
    unit: "%",
    data: [
      { x: "Environmental", y: first.EnvironmentalScore ?? 0},
      { x: "Social", y: first.SocialScore ?? 0},
      { x: "Governance", y: first.GovernanceScore ?? 0}
    ],
  },
  ];
};

/* -------------------- CovenantSummary -------------------- */
const transformCovenantSummary = (companyId: number): Dataset => ({
  name: "Covenant Summary",
  metric: "Covenant Summary" as Metric,
  unit: "%",
  data: [(companyId - 1000)],
});

/* -------------------- FETCH -------------------- */

const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
  try {
    const applicationId =
      companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

    const requests = endpoints.map((endpoint) =>
      axios.get(`/api/${endpoint}?applicationID=${applicationId}`)
    );
    const responses = await Promise.all(requests);

    const keyRatiosRes = responses.find((_, i) => endpoints[i] === "key_ratios");
    const keyRatios = keyRatiosRes?.data ?? [];

    const datasets: Dataset[] = [];

    for (let i = 0; i < responses.length; i++) {
      const endpoint = endpoints[i];
      const data = responses[i].data;
      if (!data || data.length === 0) continue;

      switch (endpoint) {
        case "abs_benchmarkings":
          datasets.push(...transformABSBenchmarking(data));
          break;
        case "forecasts":
          datasets.push(
            ...transformTimelineForecastMetrics(data, companyId, "Forecast", "ForecastID")
          );
          break;
        case "working_capital_movements":
          datasets.push(
            ...transformTimelineForecastMetrics(data, companyId, "working_capital_movements", "CapitalID")
          );
          break;
        case "covenants":
          datasets.push(...transformCovenants(data, keyRatios));
          break;
        case "company_data":
          datasets.push(...transformEGS(data));
          break;
        default:
          datasets.push(...transformTimelineMetricsPerCompany(endpoint, data));
          break;
      }
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
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (companyA?.companyId) {
          const datasetsA = await fetchCompanyDatasets(companyA.companyId);
          // Add Covenant Summary for company A
          const covenantSummaryA = transformCovenantSummary(companyA.companyId);
          setCompanyAMetric({
            ...companyA,
            datasets: [...datasetsA, covenantSummaryA],
          });
        }
        if (companyB?.companyId) {
          const datasetsB = await fetchCompanyDatasets(companyB.companyId);
          // Add Covenant Summary for company B
          const covenantSummaryB = transformCovenantSummary(companyB.companyId);
          setCompanyBMetric({
            ...companyB,
            datasets: [...datasetsB, covenantSummaryB],
          });
        }
      } finally {
        setLoading(false);
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

  const allDatasets: (Dataset & { uniqueKey: string })[] = [];
  const seen = new Set<string>();

  companyDatasets.forEach(({ datasets }) => {
    datasets.forEach((ds) => {
      const uniqueKey = `${ds.name}__${ds.metric}`;
      if (!seen.has(uniqueKey)) {
        allDatasets.push({
          ...ds,
          uniqueKey,
        });
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
          <GraphButton
            selectedKeys={finalSelectedKeys}
            companyDatasets={companyDatasets}
          />
        )}
      </div>
    </div>
  );
};

export default FilterComparisonPage;

// import { useState, useEffect } from "react";
// import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
// import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";
// import { CompareGraphButton } from "./CompareGraphButton";
// import type { Metric, Unit, Dataset } from "../Types/Types";
// import axios from "axios";

// /* -------------------- CONFIG -------------------- */

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

// /* -------------------- TYPES -------------------- */

// interface Company {
//   companyId: number;
//   companyName: string;
//   datasets?: Dataset[];
// }

// interface CompanyDataset {
//   company: string;
//   datasets: Dataset[];
// }

// interface FilterComparisonPageProps {
//   companyA: Company | null;
//   companyB: Company | null;
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

// // ✅ Fixed grouping for multi-series endpoints (Assets, Liabilities, etc.)
// const transformTimelineMetricsPerCompany = (
//   endpoint: string,
//   rawData: any[]
// ): Dataset[] => {
//   if (!rawData || rawData.length === 0) return [];

//   const grouped: Record<string, any[]> = {};
//   rawData.forEach((item) => {
//     const key =
//       item.AccountDescription ??
//       item.MetricName ??
//       item.Metric ??
//       "Unknown Metric";
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(item);
//   });

//   return Object.entries(grouped).map(([metricName, items]) => {
//     const first = items[0];
//     const xKey =
//       ["Timeline", "Period", "Year", "Date"].find((k) => k in first) ??
//       "Period";
//     const yKey =
//       ["Value", "Amount", "Balance", "Val"].find((k) => k in first) ?? "Value";

//     const data = items.map((d) => ({
//       x: Number(d[xKey]),
//       y: Number(d[yKey]),
//     }));

//     return {
//       name: metricName,
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
//     const avgHistoricalForecast =
//       first["Avg Historical Forecast"] ??
//       first["Avg Hist Forecast"] ??
//       null;

//     return {
//       name:
//         first.AccountDescription ??
//         first.Metric ??
//         first.MetricName ??
//         "Unknown",
//       metric: metricCategory,
//       unit: first.Unit as Unit,
//       data: [
//         { x: "Avg Historical Forecast", y: avgHistoricalForecast },
//         { x: "User Forecast", y: first["User Forecast"] },
//       ],
//     };
//   });
// };

// /* -------------------- COVENANTS -------------------- */

// const transformCovenants = (
//   covenantsRaw: any[],
//   keyRatios: Dataset[]
// ): CovenantDataset[] => {
//   const groupedByCategory: Record<string, any[]> = {};
//   covenantsRaw.forEach((item) => {
//     const category = item.Category ?? "Uncategorized";
//     if (!groupedByCategory[category]) groupedByCategory[category] = [];
//     groupedByCategory[category].push(item);
//   });

//   return Object.entries(groupedByCategory).map(([category, items]) => {
//     const metricList = items.map((item) => ({
//       name: item.MetricName,
//       pass: item.Analysis,
//       calc_value: Number(item.Value),
//       abs_value: item.Benchmark,
//     }));

//     let passCount = 0;
//     metricList.forEach((metric) => {
//       if (!metric.name) return;
//       const kr = keyRatios.find((k) => {
//         if (!k.name) return false;
//         return k.name.trim().toLowerCase() === metric.name.trim().toLowerCase();
//       });
//       if (kr && kr.data.length > 0) {
//         const avg = kr.data.reduce((sum, d) => sum + d.y, 0) / kr.data.length;
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

// /* -------------------- SYNTHETIC METRIC: COVENANT SUMMARY -------------------- */

// const createCovenantSummaryDataset = (applicationId: number): Dataset => ({
//   name: "Covenant Summary",
//   data: [applicationId],
//   metric: "Covenant Summary" as Metric,
//   unit: "%" as Unit,
// });

// /* -------------------- FETCH -------------------- */

// const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
//   try {
//     const applicationId =
//       companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

//     const requests = endpoints.map((endpoint) =>
//       axios.get(`/api/${endpoint}?applicationID=${applicationId}`)
//     );
//     const responses = await Promise.all(requests);

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
//             ...transformTimelineForecastMetrics(
//               data,
//               companyId,
//               "Forecast",
//               "ForecastID"
//             )
//           );
//           break;
//         case "working_capital_movements":
//           datasets.push(
//             ...transformTimelineForecastMetrics(
//               data,
//               companyId,
//               "working_capital_movements",
//               "CapitalID"
//             )
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

//     datasets.push(createCovenantSummaryDataset(applicationId));
//     return datasets;
//   } catch (err) {
//     console.error(`Error fetching datasets for company ${companyId}:`, err);
//     return [];
//   }
// };

// /* -------------------- MAIN COMPONENT -------------------- */

// const FilterComparisonPage: React.FC<FilterComparisonPageProps> = ({
//   companyA,
//   companyB,
// }) => {
//   const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [companyMetrics, setCompanyMetrics] = useState<CompanyDataset[]>([]);
//   const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!companyA && !companyB) return;
//       setLoading(true);

//       try {
//         const results: CompanyDataset[] = [];

//         if (companyA?.companyId) {
//           const datasetsA = await fetchCompanyDatasets(companyA.companyId);
//           results.push({
//             company: companyA.companyName,
//             datasets: datasetsA,
//           });
//         }

//         if (companyB?.companyId) {
//           const datasetsB = await fetchCompanyDatasets(companyB.companyId);
//           results.push({
//             company: companyB.companyName,
//             datasets: datasetsB,
//           });
//         }

//         setCompanyMetrics(results);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [companyA, companyB]);

//   // --- 🔹 Build allDatasets list for SidebarFilter (unique name__metric keys)
//   const allDatasets: (Dataset & { uniqueKey: string })[] = [];
//   const seen = new Set<string>();

//   companyMetrics.forEach(({ datasets }) => {
//     datasets.forEach((ds) => {
//       const uniqueKey = `${ds.name}__${ds.metric}`;
//       if (!seen.has(uniqueKey)) {
//         allDatasets.push({ ...ds, uniqueKey });
//         seen.add(uniqueKey);
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

//   return (
//     <div className="grid grid-rows-[35px]">
//       <div>
//         <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />
//         {sidebarOpen && (
//           <SidebarFilter
//             onClose={handleGenerate}
//             datasets={allDatasets}
//             selectedKeys={selectedKeys}
//             toggleSelection={handleToggleSelection}
//           />
//         )}
//       </div>

//       <div className="flex-1 p-4">
//         {finalSelectedKeys.length > 0 && companyMetrics.length > 0 && (
//           <CompareGraphButton
//             selectedKeys={finalSelectedKeys}
//             companyDatasets={companyMetrics}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterComparisonPage;
