// tests/services/best_four_metrics_service.httplike.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/best_four_metrics.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/services/financial_statements.service.js", () => ({
  filter_statements: jest.fn(),
}));

// --- Imports after mocks ---
const best4_model = (await import("../../src/models/best_four_metrics.model.js")).default;
const { filter_statements } = await import("../../src/services/financial_statements.service.js");
const { best4MetricsService: best4_metrics_service } = await import(
  "../../src/services/best_four_metrics.service.js"
);

// --- Helpers ---
const mock_find_select_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  const select_fn = jest.fn().mockReturnValue({ lean: lean_fn });
  model.find.mockReturnValue({ select: select_fn });
  return { select_fn, lean_fn };
};

describe("best4_metrics_service (http_like: req.query strings)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: numeric_db_query_and_filter_statements_uses_string_applicationid_then_maps_unit_and_data", async () => {
    const filters = {
      companyid: "1001",
      applicationid: "2",
    };

    const defs_rows = [
      { CompanyID: 1001, ApplicationID: 2, MetricID: 501, Metric: "Revenue" },
      { CompanyID: 1001, ApplicationID: 2, MetricID: 502, Metric: "COGS" },
    ];

    const defs_find = mock_find_select_lean(best4_model, defs_rows);

    filter_statements
      .mockResolvedValueOnce([
        { Metric: "Revenue", Unit: "AUD", Timeline: "2023", Value: 10 },
        { Metric: "Revenue", Unit: "AUD", Timeline: "2024", Value: 12 },
      ])
      .mockResolvedValueOnce([
        { Metric: "COGS", Unit: "AUD", Timeline: "2023", Value: 6 },
        { Metric: "COGS", Unit: "AUD", Timeline: "2024", Value: 7 },
      ]);

    const out = await best4_metrics_service(filters);

    // DB query uses numbers
    expect(best4_model.find).toHaveBeenCalledWith({
      CompanyID: 1001,
      ApplicationID: 2,
    });
    expect(defs_find.select_fn).toHaveBeenCalledWith("-__v");
    expect(defs_find.lean_fn).toHaveBeenCalledTimes(1);

    // downstream call uses the STRING from filters (HTTP-like)
    expect(filter_statements).toHaveBeenNthCalledWith(1, {
      financialid: 501,
      applicationid: "2",
    });
    expect(filter_statements).toHaveBeenNthCalledWith(2, {
      financialid: 502,
      applicationid: "2",
    });

    expect(out).toEqual([
      {
        CompanyID: 1001,
        ApplicationID: 2,
        Table: "financial_statements",
        MetricID: 501,
        MetricName: "Revenue",
        Unit: "AUD",
        Data: [
          { Timeline: "2023", Value: 10 },
          { Timeline: "2024", Value: 12 },
        ],
      },
      {
        CompanyID: 1001,
        ApplicationID: 2,
        Table: "financial_statements",
        MetricID: 502,
        MetricName: "COGS",
        Unit: "AUD",
        Data: [
          { Timeline: "2023", Value: 6 },
          { Timeline: "2024", Value: 7 },
        ],
      },
    ]);
  });

  test("positive_case: applicationid_fallback_uses_definition_applicationid_number_when_filter_missing", async () => {
    const defs_rows = [{ CompanyID: 9, ApplicationID: 3, MetricID: 777, Metric: "EBIT" }];
    mock_find_select_lean(best4_model, defs_rows);

    filter_statements.mockResolvedValueOnce([
      { Metric: "EBIT", Unit: "USD", Timeline: "2025", Value: 99.9 },
    ]);

    const out = await best4_metrics_service({ companyid: "9" });

    expect(filter_statements).toHaveBeenCalledWith({
      financialid: 777,
      applicationid: 3,
    });

    expect(out).toEqual([
      {
        CompanyID: 9,
        ApplicationID: 3,
        Table: "financial_statements",
        MetricID: 777,
        MetricName: "EBIT",
        Unit: "USD",
        Data: [{ Timeline: "2025", Value: 99.9 }],
      },
    ]);
  });

  test("negative_case: no_definitions_returns_empty_and_never_calls_filter_statements", async () => {
    mock_find_select_lean(best4_model, []);

    const out = await best4_metrics_service({ companyid: "1001" });

    expect(best4_model.find).toHaveBeenCalledTimes(1);
    expect(filter_statements).not.toHaveBeenCalled();
    expect(out).toEqual([]);
  });

  test("edge_case: definitions_present_but_filter_statements_returns_empty_maps_unit_null_and_empty_data", async () => {
    const defs_rows = [{ CompanyID: 1, ApplicationID: 4, MetricID: 123, Metric: "Net Income" }];
    mock_find_select_lean(best4_model, defs_rows);

    filter_statements.mockResolvedValueOnce([]);

    const out = await best4_metrics_service({ companyid: "1", applicationid: "4" });

    expect(filter_statements).toHaveBeenCalledWith({
      financialid: 123,
      applicationid: "4",
    });

    expect(out).toEqual([
      {
        CompanyID: 1,
        ApplicationID: 4,
        Table: "financial_statements",
        MetricID: 123,
        MetricName: "Net Income",
        Unit: null,
        Data: [],
      },
    ]);
  });

  test("positive_case: metricid_filter_string_is_numerically_used_for_db_and_string_applicationid_flows_downstream", async () => {
    const defs_rows = [{ CompanyID: 2, ApplicationID: 5, MetricID: 900, Metric: "Gross Profit" }];
    mock_find_select_lean(best4_model, defs_rows);

    filter_statements.mockResolvedValueOnce([
      { Metric: "Gross Profit", Unit: "AUD", Timeline: "2024", Value: 321 },
    ]);

    const out = await best4_metrics_service({
      companyid: "2",
      applicationid: "5",
      metricid: "900",
    });

    expect(best4_model.find).toHaveBeenCalledWith({
      CompanyID: 2,
      ApplicationID: 5,
      MetricID: 900,
    });

    expect(filter_statements).toHaveBeenCalledWith({
      financialid: 900,
      applicationid: "5",
    });

    expect(out).toEqual([
      {
        CompanyID: 2,
        ApplicationID: 5,
        Table: "financial_statements",
        MetricID: 900,
        MetricName: "Gross Profit",
        Unit: "AUD",
        Data: [{ Timeline: "2024", Value: 321 }],
      },
    ]);
  });
});
