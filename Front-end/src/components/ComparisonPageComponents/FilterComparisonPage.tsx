import { useState, useEffect } from "react";
import { CompareGraphButton } from "./CompareGraphButton";
import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";
import type { Metric } from "../Types/Types.tsx";
import axios from "axios";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

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

interface Dataset {
  name: string;
  data: any[];
  metric: Metric;
  unit: Unit;
  metadata?: Record<string, any>;
}

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
    return {
      name: first.AccountDescription ?? first.Metric ?? "Unknown",
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
  covenantsRaw.forEach(item => {
    const category = item.Category ?? "Uncategorized";
    if (!groupedByCategory[category]) groupedByCategory[category] = [];
    groupedByCategory[category].push(item);
  });

  return Object.entries(groupedByCategory).map(([category, items]) => {
    const metricList = items.map(item => ({
      name: item.Metric,
      pass: item.Analysis,
      calc_value: Number(item.Value),
      abs_value: item.Benchmark,
    }));

    // Calculate threeYearAvgSuccess
    let passCount = 0;
    metricList.forEach(metric => {
      if (!metric.name) return; // skip if metric name is undefined/null
      const kr = keyRatios.find(k => {
        if (!k.name) return false; // skip if key ratio name is undefined
        return k.name.trim().toLowerCase() === metric.name.trim().toLowerCase();
      });
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

/* -------------------- FETCH -------------------- */

const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
  try {
    const applicationId =
      companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

    const requests = endpoints.map((endpoint) =>
      axios.get(`/api/${endpoint}?applicationID=${applicationId}`)
    );
    const responses = await Promise.all(requests);

    // Extract key_ratios for use in covenants
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
          setCompanyAMetric({ ...companyA, datasets: datasetsA });
        }
        if (companyB?.companyId) {
          const datasetsB = await fetchCompanyDatasets(companyB.companyId);
          setCompanyBMetric({ ...companyB, datasets: datasetsB });
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

  const allDatasets: Dataset[] = [];
  const seen = new Set<string>();
  companyDatasets.forEach(({ datasets }) => {
    datasets.forEach((ds) => {
      if (!seen.has(ds.name)) {
        allDatasets.push({
          name: ds.name,
          metric: ds.metric,
          unit: ds.unit,
          data: [],
        });
        seen.add(ds.name);
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
            selectedKeys={finalSelectedKeys}
            companyDatasets={companyDatasets}
          />
        )}
      </div>
    </div>
  );
};

export default FilterComparisonPage;
