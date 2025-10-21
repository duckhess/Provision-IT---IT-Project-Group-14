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


const abs_values_schema = (await import("../../src/models/abs_values.js")).default;
const abs_schema = (await import("../../src/models/abs_benchmarkings.js")).default;
const { filter_abs } = await import("../../src/services/abs.service.js");

const mockFindLean = (model, rows) => {
  const leanFn = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: leanFn });
  return { leanFn };
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

    const valuesRows = [
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

    const benchRows = [
      { ABSID: 101, Benchmark: "Revenue per Employee", Unit: "$/emp" },
    ];

    const valuesFind = mockFindLean(abs_values_schema, valuesRows);
    const benchFind  = mockFindLean(abs_schema, benchRows);

    const result = await filter_abs(filters);

    expect(abs_values_schema.find).toHaveBeenCalledTimes(1);
    expect(abs_values_schema.find.mock.calls[0][0]).toEqual({
      ABSID: 101,
      ApplicationID: 2,
      ANZICCode: 3311,
      Analysis: true,
    });
    expect(valuesFind.leanFn).toHaveBeenCalledTimes(1);

    expect(abs_schema.find).toHaveBeenCalledTimes(1);
    expect(abs_schema.find).toHaveBeenCalledWith();
    expect(benchFind.leanFn).toHaveBeenCalledTimes(1);

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
      analysis: "false", // should set Analysis: false in the query
    };

    mockFindLean(abs_values_schema, []); // no rows
    mockFindLean(abs_schema, [
      { ABSID: 999, Benchmark: "Whatever", Unit: "units" },
    ]);

    const result = await filter_abs(filters);

    expect(abs_values_schema.find).toHaveBeenCalledWith({
      ABSID: 999,
      Analysis: false,
    });

    // No value rows → empty mapped response
    expect(result).toEqual([]);
  });
});
