import { describe, it, expect, vi } from "vitest";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Import raw JSON files
import absBenchmarkings from "./mocks/abs_benchmarkings.json";
import keyRatios from "./mocks/key_ratios.json";
import companyData from "./mocks/company_data.json";
import forecasts from "./mocks/forecasts.json";
import covenants from "./mocks/covenants.json";
import assets from "./mocks/assets.json";
import liabilities from "./mocks/liabilities.json";
import incomeStatements from "./mocks/income_statements.json";
import equities from "./mocks/equities.json";
import financialStatements from "./mocks/financial_statements.json";
import workingCapitalMovements from "./mocks/working_capital_movements.json";
import cashEquivalences from "./mocks/cash_equivalences.json";

// Import transform functions
import {
  transformABSBenchmarking,
  transformTimelineMetricsPerCompany,
  transformTimelineForecastMetrics,
  transformCovenants,
  createCovenantSummaryDataset,
  transformEGS,
} from "./MetricFormat";

/* ------------------ Helpers ------------------ */

// Flexible numeric extractor for any backend field
function getRawYValue(rawItem: any): number {
  const possibleKeys = [
    "Value",
    "Amount",
    "Balance",
    "Val",
    "CalcValue",
    "ABSValue",
    "User Forecast",
    "Avg Historical Forecast",
    "Avg Hist Forecast",
    "Revenue",
  ];
    for (const key of possibleKeys) {
        if (key in rawItem && rawItem[key] != null) {
            const val = rawItem[key];
            return typeof val === "number" ? val : Number(val);
        }
    }
    return 0;
}

/* ------------------ Tests ------------------ */

describe("Data Transform Functions", () => {
  it("transformABSBenchmarking correctly converts raw ABS data", () => {
    const datasets = transformABSBenchmarking(absBenchmarkings);
    expect(datasets).toBeInstanceOf(Array);
    datasets.forEach(ds => {
        expect(ds.data).toBeInstanceOf(Array);
        ds.data.forEach(item => {
            expect(item).toHaveProperty("name");
            expect(item).toHaveProperty("pass");
            expect(item).toHaveProperty("calc_value");
            expect(item).toHaveProperty("abs_value");
            expect(item).toHaveProperty("greater");
        });
    });
  });

  it("transformTimelineMetricsPerCompany correctly converts timeline metrics", () => {
    const endpoints = [
      { raw: assets, endpoint: "assets" },
      { raw: liabilities, endpoint: "liabilities" },
      { raw: incomeStatements, endpoint: "income_statements" },
      { raw: equities, endpoint: "equities" },
      { raw: financialStatements, endpoint: "financial_statements" },
      { raw: workingCapitalMovements, endpoint: "working_capital_movements" },
      { raw: cashEquivalences, endpoint: "cash_equivalences" },
      { raw: keyRatios, endpoint: "key_ratios" },
    ];

    endpoints.forEach(ep => {
      const datasets = transformTimelineMetricsPerCompany(ep.endpoint, ep.raw);
      expect(datasets).toBeInstanceOf(Array);
      datasets.forEach(ds => {
        expect(ds).toHaveProperty("name");
        expect(ds).toHaveProperty("metric");
        expect(ds).toHaveProperty("unit");
        expect(ds.data).toBeInstanceOf(Array);
        ds.data.forEach(d => {
        expect(d).toHaveProperty("x");
        expect(d).toHaveProperty("y");
        expect(typeof d.y).toBe("number");
        expect(Number.isFinite(d.y)).toBe(true);
        });
      });
    });
  });

  it("transformTimelineForecastMetrics correctly converts forecast data", () => {
    const companyId = 1001;
    const datasets = transformTimelineForecastMetrics(forecasts, companyId, "Forecast", "ForecastID");
    expect(datasets).toBeInstanceOf(Array);
    datasets.forEach(ds => {
      expect(ds.data.length).toBe(2);
      ds.data.forEach(d => {
        expect(d).toHaveProperty("x");
        expect(d).toHaveProperty("y");
        // convert to number if needed
        const val = Number(d.y ?? 0);
        expect(typeof val).toBe("number");
        expect(Number.isFinite(val)).toBe(true);
        });
    });
  });

  it("transformCovenants correctly converts covenant data", async () => {
    const id = 1;

    const mockSuccessData = [
        {
        ApplicationID: 1,
        Category: "Liquidity",
        "3 yr Average % Success": 85,
        },
    ];

    (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockSuccessData });

    const datasets = await transformCovenants(covenants, id);

    expect(axios.get).toHaveBeenCalledWith(
        `/api/category/?applicationid=${encodeURIComponent(id)}`
    );

    expect(datasets).toBeInstanceOf(Array);
    datasets.forEach((ds) => {
        expect(ds.data).toBeInstanceOf(Array);
        expect(ds).toHaveProperty("metadata");
        ds.data[0].forEach((metric) => {
        expect(metric).toHaveProperty("name");
        expect(metric).toHaveProperty("pass");
        expect(metric).toHaveProperty("calc_value");
        expect(metric).toHaveProperty("abs_value");
        });
    });
    });

  it("createCovenantSummaryDataset returns proper dataset", () => {
    const dataset = createCovenantSummaryDataset(1001);
    expect(dataset).toHaveProperty("name", "Covenant Summary");
    expect(dataset).toHaveProperty("data");
    expect(dataset.data[0]).toBe(1001);
  });

  it("transformEGS correctly converts company data", () => {
    const datasets = transformEGS(companyData);
    expect(datasets).toBeInstanceOf(Array);
    datasets.forEach(ds => {
      expect(ds).toHaveProperty("name", "EGS Score");
      expect(ds.data.length).toBe(3);
      ds.data.forEach(d => {
        expect(d).toHaveProperty("x");
        expect(d).toHaveProperty("y");
        const val = d.y;
        expect(typeof val).toBe("number");
      });
    });
  });
});
