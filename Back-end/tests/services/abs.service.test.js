import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/models/abs_values.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/abs_benchmarkings.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

const abs_values_model = (await import("../../src/models/abs_values.js")).default;
const abs_benchmarkings_model = (await import("../../src/models/abs_benchmarkings.js")).default;
const { filter_abs } = await import("../../src/services/abs.service.js");

const mock_find_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_fn });
  return { lean_fn };
};

describe("filter_abs service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: converts filters, queries both collections, and maps benchmark fields", async () => {
    const filters = {
      absid: "101",
      applicationid: "2",
      anziccode: "3311",
      analysis: "true",
    };

    const values_rows = [
      {
        ABSID: 101,
        ApplicationID: 2,
        ANZICCode: 3311,
        Field: "Some Field",
        ABSValue: 12.34,
        CalcValue: 56.78,
        Analysis: true,
      },
    ];

    const bench_rows = [{ ABSID: 101, Benchmark: "Revenue per Employee", Unit: "$/emp" }];

    const values_find = mock_find_lean(abs_values_model, values_rows);
    const bench_find = mock_find_lean(abs_benchmarkings_model, bench_rows);

    const result = await filter_abs(filters);

    expect(abs_values_model.find).toHaveBeenCalledTimes(1);
    expect(abs_values_model.find.mock.calls[0][0]).toEqual({
      ABSID: 101,
      ApplicationID: 2,
      ANZICCode: 3311,
      Analysis: true,
    });
    expect(values_find.lean_fn).toHaveBeenCalledTimes(1);

    expect(abs_benchmarkings_model.find).toHaveBeenCalledTimes(1);
    expect(abs_benchmarkings_model.find).toHaveBeenCalledWith();
    expect(bench_find.lean_fn).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        ABSID: 101,
        Benchmark: "Revenue per Employee",
        Unit: "$/emp",
        ApplicationID: 2,
        ANZICCode: 3311,
        Field: "Some Field",
        ABSValue: 12.34,
        CalcValue: 56.78,
        Analysis: true,
      },
    ]);
  });

  test("Negative: no matching values (or analysis='false') → empty list; also analysis filter conversion", async () => {
    const filters = {
      absid: "999",
      analysis: "false",
    };

    mock_find_lean(abs_values_model, []);
    mock_find_lean(abs_benchmarkings_model, [{ ABSID: 999, Benchmark: "Whatever", Unit: "units" }]);

    const result = await filter_abs(filters);

    expect(abs_values_model.find).toHaveBeenCalledWith({
      ABSID: 999,
      Analysis: false,
    });

    expect(result).toEqual([]);
  });
});
