import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/cash_values.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/cash_equivalences.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

// --- Imports after mocks ---
const cash_values_schema = (await import("../../src/models/cash_values.js")).default;
const cash_schema = (await import("../../src/models/cash_equivalences.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { filter_cash_equivalences } = await import(
  "../../src/services/cash_equivalences.service.js"
);

// --- Helpers ---
const mock_find_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_fn });
  return { lean_fn };
};

describe("filter_cash_equivalences (http_like: req.query strings)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: numeric_query_join_meta_map_timeline_and_parse_value", async () => {
    const filters = {
      cashid: "10",
      applicationid: "2",
      fileid: "3",
    };

    // values collection (Value as string to exercise parseFloat)
    const value_rows = [{ CashID: 10, ApplicationID: 2, FileID: 3, Value: "42.50" }];
    const values_find = mock_find_lean(cash_values_schema, value_rows);

    // document/meta collection
    const doc_rows = [{ CashID: 10, Metric: "Cash & Cash Equivalents", Unit: "AUD" }];
    const docs_find = mock_find_lean(cash_schema, doc_rows);

    // timeline mapping
    get_period.mockResolvedValue(new Map([[3, "2024"]]));

    const out = await filter_cash_equivalences(filters);

    // values query uses numeric conversions
    expect(cash_values_schema.find).toHaveBeenCalledWith({
      CashID: 10,
      ApplicationID: 2,
      FileID: 3,
    });
    expect(values_find.lean_fn).toHaveBeenCalledTimes(1);

    // documents query is a plain find() with no filter
    expect(cash_schema.find).toHaveBeenCalledWith();
    expect(docs_find.lean_fn).toHaveBeenCalledTimes(1);

    // timeline computed for distinct file_ids
    expect(get_period).toHaveBeenCalledWith([3]);

    // final mapped output
    expect(out).toEqual([
      {
        CashID: 10,
        MetricName: "Cash & Cash Equivalents",
        Unit: "AUD",
        ApplicationID: 2,
        Timeline: "2024",
        Value: 42.5,
      },
    ]);
  });

  test("negative_case: no_value_rows_returns_empty_and_still_calls_docs_and_timeline", async () => {
    mock_find_lean(cash_values_schema, []);
    mock_find_lean(cash_schema, [{ CashID: 99, Metric: "Should not matter", Unit: "AUD" }]);

    get_period.mockResolvedValue(new Map());

    const out = await filter_cash_equivalences({
      cashid: "999",
      applicationid: "1",
    });

    // numeric conversion on values query
    expect(cash_values_schema.find).toHaveBeenCalledWith({
      CashID: 999,
      ApplicationID: 1,
    });

    // docs + timeline still called, but with empty file_ids
    expect(cash_schema.find).toHaveBeenCalledWith();
    expect(get_period).toHaveBeenCalledWith([]);

    expect(out).toEqual([]);
  });
});
