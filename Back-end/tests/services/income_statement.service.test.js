import { jest } from "@jest/globals";

// Mock the models
jest.unstable_mockModule("../../src/models/income_statement.model.js", () => ({
  default: { find: jest.fn() },
}));

jest.unstable_mockModule("../../src/models/income_statement_values.model.js", () => ({
  default: { find: jest.fn() },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

const income_schema = (await import("../../src/models/income_statement.model.js")).default;
const income_values_schema = (await import("../../src/models/income_statement_values.model.js"))
  .default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { income_service } = await import("../../src/services/income_statement.service.js");

// Helper to mock .find().select().lean()
const mock_find_lean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  const select_function = jest.fn().mockReturnValue({ lean: lean_function });
  model.find.mockReturnValue({ select: select_function });
  return { select_function, lean_function };
};

describe("income_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: filters and joins correctly", async () => {
    const filters = { incomeid: "1", applicationid: "10", metric: "Revenue", unit: "$" };

    // Mock Decimal128-like object
    const converted_decimal = { _bsontype: "Decimal128", toString: () => "123.45" };

    const value_rows = [{ IncomeID: 1, FileID: 100, ApplicationID: 10, Value: converted_decimal }];
    const key_rows = [{ IncomeID: 1, Metric: "Revenue", Unit: "$" }];

    mock_find_lean(income_values_schema, value_rows);
    mock_find_lean(income_schema, key_rows);

    get_period.mockResolvedValue(new Map([[100, "2025-Q4"]]));

    const result = await income_service(filters);

    // Check values query
    expect(income_values_schema.find).toHaveBeenCalledWith({
      IncomeID: 1,
      ApplicationID: 10,
    });

    // Check key query
    expect(income_schema.find).toHaveBeenCalledWith({
      IncomeID: { $in: [1] },
      Metric: { $regex: "Revenue", $options: "i" },
      Unit: { $regex: "\\$", $options: "i" },
    });

    // Check returned results
    expect(result).toEqual([
      {
        IncomeID: 1,
        MetricName: "Revenue",
        Unit: "$",
        ApplicationID: 10,
        Timeline: "2025-Q4",
        Value: 123.45,
      },
    ]);
  });

  test("Negative: no matching values → empty array", async () => {
    const filters = { incomeid: "999" };

    mock_find_lean(income_values_schema, []);
    mock_find_lean(income_schema, [{ IncomeID: 999, Metric: "Revenue", Unit: "$" }]);

    const result = await income_service(filters);

    expect(income_values_schema.find).toHaveBeenCalledWith({ IncomeID: 999 });
    expect(result).toEqual([]);
  });

  test("Negative: no matching keys → empty array", async () => {
    const filters = { incomeid: "1" };

    mock_find_lean(income_values_schema, [
      { IncomeID: 1, FileID: 10, ApplicationID: 1, Value: 50 },
    ]);
    mock_find_lean(income_schema, []); // no matching key rows

    const result = await income_service(filters);

    expect(result).toEqual([]);
  });
});
