// tests/services/covenants_service.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/covenants_values.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/covenants.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

// --- Imports after mocks ---
const covenants_values_schema = (await import("../../src/models/covenants_values.js")).default;
const covenants_schema = (await import("../../src/models/covenants.js")).default;
const { filter_covenants } = await import("../../src/services/covenants.service.js");

// --- Helpers ---
const mock_find_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_fn });
  return { lean_fn };
};

describe("filter_covenants (http_like: req.query strings)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: converts_filters_numbers_and_analysis_true_then_maps_fields", async () => {
    const filters = {
      covenantsid: "10",
      applicationid: "2",
      analysis: "true",
    };

    const value_rows = [
      {
        CovenantsID: 10,
        ApplicationID: 2,
        Value: 1.5,
        Comparator: "<=",
        Analysis: true,
      },
      {
        CovenantsID: 10,
        ApplicationID: 2,
        Value: 2.0,
        Comparator: "<=",
        Analysis: true,
      },
    ];
    const values_find = mock_find_lean(covenants_values_schema, value_rows);

    const doc_rows = [
      {
        CovenantsID: 10,
        Metric: "Current Ratio",
        Benchmark: ">= 1.2",
        Category: "Liquidity",
        Unit: "x",
      },
    ];
    const docs_find = mock_find_lean(covenants_schema, doc_rows);

    const out = await filter_covenants(filters);

    expect(covenants_values_schema.find).toHaveBeenCalledWith({
      CovenantsID: 10,
      ApplicationID: 2,
      Analysis: true,
    });
    expect(values_find.lean_fn).toHaveBeenCalledTimes(1);

    expect(covenants_schema.find).toHaveBeenCalledWith();
    expect(docs_find.lean_fn).toHaveBeenCalledTimes(1);

    expect(out).toEqual([
      {
        CovenantsID: 10,
        MetricName: "Current Ratio",
        Benchmark: ">= 1.2",
        Category: "Liquidity",
        Unit: "x",
        ApplicationID: 2,
        Value: 1.5,
        Comparator: "<=",
        Analysis: true,
      },
      {
        CovenantsID: 10,
        MetricName: "Current Ratio",
        Benchmark: ">= 1.2",
        Category: "Liquidity",
        Unit: "x",
        ApplicationID: 2,
        Value: 2.0,
        Comparator: "<=",
        Analysis: true,
      },
    ]);
  });

  test("negative_case: no_value_rows_returns_empty_array", async () => {
    mock_find_lean(covenants_values_schema, []);
    mock_find_lean(covenants_schema, [
      { CovenantsID: 99, Metric: "Ignore", Benchmark: "-", Category: "X", Unit: "-" },
    ]);

    const out = await filter_covenants({
      covenantsid: "999",
      applicationid: "1",
      analysis: "false",
    });

    expect(covenants_values_schema.find).toHaveBeenCalledWith({
      CovenantsID: 999,
      ApplicationID: 1,
      Analysis: false,
    });

    expect(out).toEqual([]);
  });

  test("positive_case: analysis_false_converts_to_boolean_false_and_maps_fields", async () => {
    const filters = {
      applicationid: "3",
      analysis: "false",
    };

    const value_rows = [
      {
        CovenantsID: 20,
        ApplicationID: 3,
        Value: 55,
        Comparator: ">=",
        Analysis: false,
      },
      {
        CovenantsID: 21,
        ApplicationID: 3,
        Value: 2.7,
        Comparator: "<=",
        Analysis: false,
      },
    ];
    mock_find_lean(covenants_values_schema, value_rows);

    const doc_rows = [
      {
        CovenantsID: 20,
        Metric: "EBITDA Margin",
        Benchmark: ">= 50%",
        Category: "Profitability",
        Unit: "%",
      },
      {
        CovenantsID: 21,
        Metric: "Debt/EBITDA",
        Benchmark: "<= 3.0",
        Category: "Leverage",
        Unit: "x",
      },
    ];
    mock_find_lean(covenants_schema, doc_rows);

    const out = await filter_covenants(filters);

    expect(covenants_values_schema.find).toHaveBeenCalledWith({
      ApplicationID: 3,
      Analysis: false,
    });

    const sort_by_id = (arr) => [...arr].sort((a, b) => a.CovenantsID - b.CovenantsID);

    expect(sort_by_id(out)).toEqual(
      sort_by_id([
        {
          CovenantsID: 20,
          MetricName: "EBITDA Margin",
          Benchmark: ">= 50%",
          Category: "Profitability",
          Unit: "%",
          ApplicationID: 3,
          Value: 55,
          Comparator: ">=",
          Analysis: false,
        },
        {
          CovenantsID: 21,
          MetricName: "Debt/EBITDA",
          Benchmark: "<= 3.0",
          Category: "Leverage",
          Unit: "x",
          ApplicationID: 3,
          Value: 2.7,
          Comparator: "<=",
          Analysis: false,
        },
      ]),
    );
  });
});
