import { useState, useEffect } from "react";
import { CompareGraphButton } from "./CompareGraphButton";
import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";
import type { Metric } from "../Types/Types.tsx";
import axios from "axios";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

const endpoints = [
  "abs_benchmarkings",
  "liabilities",
  "income_statements",
  "equities",
  "financial_statements",
  "key_ratios",
  "working_capital_movements",
];

// Optional: human-readable metric names for sidebar/graph
const humanReadableMetric: Record<string, string> = {
  abs_benchmarkings: "ABS Benchmarking",
  liabilities: "Liabilities",
  income_statements: "Income Statements",
  equities: "Equities",
  financial_statements: "Financial Statements",
  key_ratios: "Key Ratios",
  working_capital_movements: "Working Capital Movements",
};

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

// --- Transform Functions ---

const transformABSBenchmarking = (data: any[], companyId: number): Dataset[] => {
  const applicationId =
    companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;
  const filtered = data.filter((item) => item.ApplicationID === applicationId);

  return [
    {
      name: "ABS Benchmarking",
      metric: "ABS Benchmarking",
      unit: filtered[0]?.Unit ?? "Benchmark",
      data: filtered.map((item) => ({
        name: item.Benchmark,
        pass: item.Analysis,
        calc_value: item.CalcValue,
        abs_value: item.ABSValue,
        greater: item.Analysis
          ? item.CalcValue > item.ABSValue
          : item.CalcValue < item.ABSValue,
      })),
      metadata: {
        ANZICCode: filtered[0]?.ANZICCode ?? null,
        field: filtered[0]?.Field ?? null,
      },
    },
  ];
};

const transformTimelineMetricsPerCompany = (endpoint: string, rawData: any[], companyId: number): Dataset[] => {
  // Map frontend companyId (1001–1004) → backend ApplicationID (1–4)
  const applicationId =
    companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;

  // Filter rawData to only include this company
  const filtered = rawData.filter((item) => item.ApplicationID === applicationId);

  if (filtered.length === 0) return [];

  // Determine ID field (KeyRatioID, LiabilityID, etc.)
  const idKey =
    "KeyRatioID" in filtered[0]
      ? "KeyRatioID"
      : "LiabilityID" in filtered[0]
      ? "LiabilityID"
      : "FinancialID" in filtered[0]
      ? "FinancialID"
      : "EquityID" in filtered[0]
      ? "EquityID"
      : "IncomeID" in filtered[0]
      ? "IncomeID"
      : "ID";

  // Group by metric ID
  const grouped: Record<string | number, any[]> = {};
  filtered.forEach((item) => {
    const id = item[idKey];
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(item);
  });

  // Map to frontend Dataset format
  return Object.values(grouped).map((items) => ({
    name: items[0].MetricName ?? items[0].name ?? endpoint,
    metric: endpoint as Metric,
    unit: items[0].Unit as Unit,
    data: items.map(d => ({
      x: Number(d.Timeline), // or parseInt/Date if Timeline is a string
      y: Number(d.Value),
    })),
  }));
};

// --- Fetch Company Datasets ---

const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
  try {

    const applicationId =
    companyId >= 1001 && companyId <= 1004 ? companyId - 1000 : companyId;
  
    const requests = endpoints.map((endpoint) =>
      axios.get(`/api/${endpoint}?applicationID=${applicationId}`)
    );

    const responses = await Promise.all(requests);

    const datasets: Dataset[] = responses.flatMap((res, i) => {
      const endpoint = endpoints[i];
      if (!res.data || res.data.length === 0) return [];

      if (endpoint === "abs_benchmarkings") {
        return transformABSBenchmarking(res.data, companyId);
      } else {
        return transformTimelineMetricsPerCompany(endpoint, res.data, companyId);
      }
    });

    return datasets;
  } catch (err) {
    console.error(`Error fetching datasets for company ${companyId}:`, err);
    return [];
  }
};

// --- Component ---

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

  // Keep per-company datasets separate
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

  // --- Build sidebar metrics (deduplicated by name) ---
  const allDatasets: Dataset[] = [];
  const seen = new Set<string>();
  companyDatasets.forEach(({ datasets }) => {
    datasets.forEach((ds) => {
      if (!seen.has(ds.name)) {
        allDatasets.push({
          name: ds.name,
          metric: ds.metric,
          unit: ds.unit,
          data: [], // sidebar only needs metric name
        });
        seen.add(ds.name);
      }
    });
  });

  // --- Handlers ---
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

