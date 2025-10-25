import { jest } from "@jest/globals";

// --- Mock all dependent modules ---
jest.unstable_mockModule("../../src/models/financial_statements.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/financial_statements_values.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

// --- Import after mocks ---
const financial_schema = (await import("../../src/models/financial_statements.js")).default;
const financial_values_schema = (await import("../../src/models/financial_statements_values.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { filter_statements } = await import("../../src/services/financial_statements.service.js");

// --- Helper for mocking find().lean() chain ---
const mockFindLean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_function });
  return { lean_function };
};

describe("filter_statements service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: filters applied, joins financial + values + timeline correctly", async () => {
    const filters = {
      financialid: 1,
      applicationid: 2,
      fileid: 3,
    };

    const values = [
      { FinancialID: 1, ApplicationID: 2, FileID: 3, Value: 1134824 },
    ];

    const documents = [
      { FinancialID: 1, Metric: "Revenue", Unit: "$" },
    ];

    const timeline_map = new Map([[3, 2025]]);

    // mock DB + timeline service
    const value_found = mockFindLean(financial_values_schema, values);
    const docs_found = mockFindLean(financial_schema, documents);
    get_period.mockResolvedValue(timeline_map);

    const result = await filter_statements(filters);

    // --- Expectations ---
    expect(financial_values_schema.find).toHaveBeenCalledWith({
      FinancialID: 1,
      ApplicationID: 2,
      FileID: 3,
    });
    expect(value_found.lean_function).toHaveBeenCalledTimes(1);

    expect(financial_schema.find).toHaveBeenCalledTimes(1);
    expect(docs_found.lean_function).toHaveBeenCalledTimes(1);

    expect(get_period).toHaveBeenCalledWith([3]);

    expect(result).toEqual([
      {
        FinancialID: 1,
        MetricName: "Revenue",
        Unit: "$",
        ApplicationID: 2,
        Timeline: 2025,
        Value: 1134824,
      },
    ]);
  });

  test("Negative: no matching values → empty array", async () => {
    const filters = { financialid: "999" };

    mockFindLean(financial_values_schema, []); // no values
    mockFindLean(financial_schema, [
      { FinancialID: 999, Metric: "Expenses", Unit: "$" },
    ]);
    get_period.mockResolvedValue(new Map());

    const result = await filter_statements(filters);

    expect(financial_values_schema.find).toHaveBeenCalledWith({ FinancialID: 999 });
    expect(result).toEqual([]);
  });

  test("Edge case: no fileIDs → get_period returns empty map", async () => {
    const filters = { applicationid: 7 };

    const values = [
      { FinancialID: 50, ApplicationID: 7, FileID: 100, Value: "999.99" },
    ];
    const documents = [
      { FinancialID: 50, Metric: "Profit Margin", Unit: "%" },
    ];

    const value_found = mockFindLean(financial_values_schema, values);
    const docs_found = mockFindLean(financial_schema, documents);
    get_period.mockResolvedValue(new Map());

    const result = await filter_statements(filters);

    expect(financial_values_schema.find).toHaveBeenCalledWith({ ApplicationID: 7 });
    expect(get_period).toHaveBeenCalledWith([100]);
    expect(result).toEqual([
      {
        FinancialID: 50,
        MetricName: "Profit Margin",
        Unit: "%",
        ApplicationID: 7,
        Timeline: undefined,
        Value: 999.99,
      },
    ]);
  });
});
