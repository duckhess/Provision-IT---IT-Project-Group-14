import { jest } from "@jest/globals";
import mongoose from "mongoose";

// Mock models
jest.unstable_mockModule("../../src/models/liability.model.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/models/liability_value.model.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

const liability_schema = (await import("../../src/models/liability.model.js")).default;
const liability_values_schema = (await import("../../src/models/liability_value.model.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { liability_service } = await import("../../src/services/liability.service.js");

// Helper to mock .find().select().lean()
const mock_find_select_lean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  const select_function = jest.fn(() => ({ lean: lean_function }));
  model.find.mockReturnValue({ select: select_function });
  return { select_function, lean_function };
};

describe("liability_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Negative Test Cases ----------
  test("Negative case: no matching values → returns empty array", async () => {
    mock_find_select_lean(liability_values_schema, []);
    mock_find_select_lean(liability_schema, []);
    get_period.mockResolvedValue(new Map());

    const result = await liability_service({});

    expect(liability_values_schema.find).toHaveBeenCalledWith({});
    expect(result).toEqual([]);
  });

  test("Negative case: keyDocs filter excludes all liability docs → returns empty array", async () => {
    // values found, but liability_schema returns nothing
    const value_docs = [{ LiabilitiesID: 1, ApplicationID: 2, FileID: 99, Value: 100 }];
    mock_find_select_lean(liability_values_schema, value_docs);
    mock_find_select_lean(liability_schema, []); // no docs matched in liability_schema
    get_period.mockResolvedValue(new Map([[99, 202510]]));

    const result = await liability_service({ liabilityid: "1" });

    expect(result).toEqual([]);
  });

  // ---------- Positive Test Cases ----------
  test("Positive case: returns mapped liabilities with Decimal128 and filtered by metric/unit", async () => {
    const value_docs = [
      {
        LiabilitiesID: 1,
        ApplicationID: 2,
        FileID: 99,
        Value: mongoose.Types.Decimal128.fromString("123.45"),
      },
    ];
    const liability_docs = [{ LiabilitiesID: 1, Metric: "Revenue", Unit: "$" }];

    mock_find_select_lean(liability_values_schema, value_docs);
    mock_find_select_lean(liability_schema, liability_docs);
    get_period.mockResolvedValue(new Map([[99, 202510]]));

    const result = await liability_service({ liabilityid: "1", metric: "Revenue", unit: "$" });

    expect(result.length).toBe(1);
    expect(result[0].LiabilityID).toBe(1);
    expect(result[0].MetricName).toBe("Revenue");
    expect(result[0].Unit).toBe("$");
    expect(result[0].Timeline).toBe(202510);
    expect(result[0].Value).toBe(123.45); // Decimal128 converted to JS number
  });

  test("Positive case: only fileID filter → triggers FileID branch", async () => {
    const value_docs = [{ LiabilitiesID: 1, ApplicationID: 2, FileID: 99, Value: 500 }];
    const liability_docs = [{ LiabilitiesID: 1, Metric: "Profit", Unit: "$" }];

    mock_find_select_lean(liability_values_schema, value_docs);
    mock_find_select_lean(liability_schema, liability_docs);
    get_period.mockResolvedValue(new Map([[99, 202511]]));

    const result = await liability_service({ fileid: "99" });

    expect(result.length).toBe(1);
    expect(result[0].Timeline).toBe(202511);
    expect(result[0].MetricName).toBe("Profit");
    expect(result[0].Value).toBe(500);
  });

  test("Positive case: multiple liability values → multiple FileIDs mapped by get_period", async () => {
    const value_docs = [
      { LiabilitiesID: 1, ApplicationID: 2, FileID: 99, Value: 100 },
      { LiabilitiesID: 2, ApplicationID: 3, FileID: 100, Value: 200 },
    ];
    const liability_docs = [
      { LiabilitiesID: 1, Metric: "Revenue", Unit: "$" },
      { LiabilitiesID: 2, Metric: "Profit", Unit: "$" },
    ];

    mock_find_select_lean(liability_values_schema, value_docs);
    mock_find_select_lean(liability_schema, liability_docs);
    get_period.mockResolvedValue(
      new Map([
        [99, 202510],
        [100, 202511],
      ]),
    );

    const result = await liability_service({});

    expect(result.length).toBe(2);
    expect(result[0].Timeline).toBe(202510);
    expect(result[1].Timeline).toBe(202511);
    expect(result[0].Value).toBe(100);
    expect(result[1].Value).toBe(200);
  });
});
