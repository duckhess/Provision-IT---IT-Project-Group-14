import type { Dataset, Metric, Unit } from "../Types/Types";
import axios from "axios";

export const endpoints = [
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


export interface Company {
  companyId: number;
  companyName: string;
  datasets?: Dataset[];
}

export interface CompanyDataset {
  company: string;
  datasets: Dataset[];
}

export interface CovenantMetricItem {
  name: string;
  pass: boolean;
  calc_value: number;
  abs_value: number;
}

export interface CovenantDataset extends Dataset {
  data: CovenantMetricItem[][];
  metadata?: {
    threeYearAvgSuccess: number;
  };
}

/* -------------------- TRANSFORMS -------------------- */

export const transformABSBenchmarking = (data: any[]): Dataset[] => [
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

export const transformTimelineMetricsPerCompany = (
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

  return Object.values(grouped).map((items) => {
    const first = items[0];
    const xKey =
      ["Timeline", "Period", "Year", "Date"].find((k) => k in first) ?? "Period";
    const yKey =
      ["Value", "Amount", "Balance", "Val"].find((k) => k in first) ?? "Value";

    const data = items.map((d) => ({
      x: Number(d[xKey]),
      y: Number(d[yKey]),
    }));

    return {
      name:
        first.MetricName ??
        first.Metric ??
        first.AccountDescription ??
        first.accountDescription ??
        endpoint,
      metric: endpoint as Metric,
      unit: first.Unit as Unit,
      data,
    };
  });
};

export const transformTimelineForecastMetrics = (
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
    const avgHistoricalForecast =
      first["Avg Historical Forecast"] ??
      first["Avg Hist Forecast"] ??
      null;

    return {
      name:
        first.AccountDescription ?? first.Metric ?? first.MetricName ?? "Unknown",
      metric: metricCategory,
      unit: first.Unit as Unit,
      data: [
        { x: "Avg Historical Forecast", y: avgHistoricalForecast },
        { x: "User Forecast", y: first["User Forecast"] },
      ],
    };
  });
};

/* -------------------- COVENANTS -------------------- */

export const transformCovenants = (
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
      name: item.MetricName,
      pass: item.Analysis,
      calc_value: Number(item.Value),
      abs_value: item.Benchmark,
    }));

    let passCount = 0;
    metricList.forEach((metric) => {
      if (!metric.name) return;
      const kr = keyRatios.find((k) => {
        if (!k.name) return false;
        return k.name.trim().toLowerCase() === metric.name.trim().toLowerCase();
      });
      if (kr && kr.data.length > 0) {
        const avg = kr.data.reduce((sum, d) => sum + d.y, 0) / kr.data.length;
        const latest = kr.data[kr.data.length - 1].y;
        if (avg > latest) passCount += 1;
      }
    });

    const threeYearAvgSuccess =
      metricList.length > 0 ? (passCount / metricList.length) * 100 : 0;

    return {
      name: category,
      metric: "covenants" as Metric,
      unit: category as Unit,
      data: [metricList],
      metadata: { threeYearAvgSuccess },
    };
  });
};

/* -------------------- SYNTHETIC METRIC: COVENANT SUMMARY -------------------- */

export const createCovenantSummaryDataset = (applicationId: number): Dataset => ({
  name: "Covenant Summary",
  data: [applicationId],
  metric: "Covenant Summary" as Metric,
  unit: "%" as Unit,
});


/* -------------------- FETCH -------------------- */

export const fetchCompanyDatasets = async (companyId: number): Promise<Dataset[]> => {
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


    datasets.push(createCovenantSummaryDataset(applicationId));

    return datasets;
  } catch (err) {
    console.error(`Error fetching datasets for company ${companyId}:`, err);
    return [];
  }
};

export const transformCovenantSummary = (companyId: number): Dataset => ({
  name: "Covenant Summary",
  metric: "Covenant Summary" as Metric,
  unit: "%",
  data: [(companyId - 1000)],
});

export const transformEGS = (companyData: any[]): Dataset[] => {
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
