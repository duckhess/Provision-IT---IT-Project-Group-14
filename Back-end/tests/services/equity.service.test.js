// __tests__/equity_service.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/equity_values.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/equity.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

// --- Imports after mocks ---
const equity_value_model = (await import("../../src/models/equity_values.model.js")).default;
const equity_model = (await import("../../src/models/equity.model.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { equity_service } = await import("../../src/services/equity.service.js");

// --- Helpers ---
const mock_find_select_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  const select_fn = jest.fn().mockReturnValue({ lean: lean_fn });
  model.find.mockReturnValue({ select: select_fn });
  return { select_fn, lean_fn };
};

// Minimal Decimal128-like mock for toJsNumber coverage
const decimal128 = (s) => ({
  _bsontype: "Decimal128",
  toString: () => String(s),
});

describe("equity_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: converts_numeric_filters_applies_metric_unit_regex_joins_meta_maps_timeline_and_converts_decimal", async () => {
    const filters = {
      equityid: "7",
      applicationid: "2",
      fileid: "5",
      metric: "ROE (return on equity)",
      unit: "%",
    };

    const values_rows = [
      {
        EquityID: 7,
        ApplicationID: 2,
        FileID: 5,
        Period: undefined,
        Value: decimal128("42.5"),
      },
    ];

    const key_docs = [
      {
        EquityID: 7,
        Metric: "ROE (Return on Equity)",
        Unit: "%",
      },
    ];

    const values_find = mock_find_select_lean(equity_value_model, values_rows);
    const keys_find = mock_find_select_lean(equity_model, key_docs);

    get_period.mockResolvedValue(new Map([[5, "2024"]]));

    const result = await equity_service(filters);

    // values query
    expect(equity_value_model.find).toHaveBeenCalledTimes(1);
    expect(equity_value_model.find).toHaveBeenCalledWith({
      EquityID: 7,
      ApplicationID: 2,
      FileID: 5,
    });
    expect(values_find.select_fn).toHaveBeenCalledWith("-__v -_id");
    expect(values_find.lean_fn).toHaveBeenCalledTimes(1);

    // key/meta query with regex filters
    expect(equity_model.find).toHaveBeenCalledTimes(1);
    const key_arg = equity_model.find.mock.calls[0][0];
    expect(key_arg).toEqual(
      expect.objectContaining({
        EquityID: { $in: [7] },
        Metric: { $regex: "ROE \\(return on equity\\)", $options: "i" },
        Unit: { $regex: "%", $options: "i" },
      }),
    );
    expect(keys_find.select_fn).toHaveBeenCalledWith("-_id EquityID Metric Unit ");
    expect(keys_find.lean_fn).toHaveBeenCalledTimes(1);

    // timeline mapping called with unique FileIDs
    expect(get_period).toHaveBeenCalledWith([5]);

    // final mapped result with Decimal128 -> number, metric name, and timeline
    expect(result).toEqual([
      {
        EquityID: 7,
        MetricName: "ROE (Return on Equity)",
        Unit: "%",
        ApplicationID: 2,
        Timeline: "2024",
        Value: 42.5,
      },
    ]);
  });

  test("negative_case: no_values_found_returns_empty_and_skips_meta_and_timeline_queries", async () => {
    mock_find_select_lean(equity_value_model, []);
    const keys_find = mock_find_select_lean(equity_model, []); // safety; should not be used

    const result = await equity_service({ equityid: "99" });

    expect(equity_value_model.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);

    // ensure no meta fetch or timeline when values empty
    expect(equity_model.find).toHaveBeenCalledTimes(0);
    expect(get_period).toHaveBeenCalledTimes(0);

    void keys_find; // avoid unused var in test env
  });

  test("negative_case: values_found_but_no_matching_meta_rows_returns_empty", async () => {
    const values_rows = [{ EquityID: 9, ApplicationID: 2, FileID: 3, Value: 100.0 }];
    mock_find_select_lean(equity_value_model, values_rows);

    // no meta rows
    mock_find_select_lean(equity_model, []);

    get_period.mockResolvedValue(new Map([[3, "2025"]]));

    const result = await equity_service({ equityid: "9", applicationid: "2" });

    expect(equity_value_model.find).toHaveBeenCalledWith({
      EquityID: 9,
      ApplicationID: 2,
    });
    expect(equity_model.find).toHaveBeenCalledWith({
      EquityID: { $in: [9] },
    });
    expect(result).toEqual([]);
  });

  test("query_building_case: when_metric_unit_filters_absent_do_not_include_them_in_key_query", async () => {
    const values_rows = [{ EquityID: 11, ApplicationID: 1, FileID: 2, Value: 7 }];
    mock_find_select_lean(equity_value_model, values_rows);

    const key_docs = [{ EquityID: 11, Metric: "EPS", Unit: "cents" }];
    mock_find_select_lean(equity_model, key_docs);

    get_period.mockResolvedValue(new Map([[2, "2023"]]));

    const result = await equity_service({
      equityid: "11",
      applicationid: "1",
      fileid: "2",
      // no metric/unit filters
    });

    const key_arg = equity_model.find.mock.calls[0][0];
    expect(key_arg).toEqual(
      expect.objectContaining({
        EquityID: { $in: [11] },
      }),
    );
    expect(key_arg).not.toHaveProperty("Metric");
    expect(key_arg).not.toHaveProperty("Unit");

    expect(result).toEqual([
      {
        EquityID: 11,
        MetricName: "EPS",
        Unit: "cents",
        ApplicationID: 1,
        Timeline: "2023",
        Value: 7,
      },
    ]);
  });
});
