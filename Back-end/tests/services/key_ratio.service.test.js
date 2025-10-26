import { jest } from "@jest/globals";

// Mock models
jest.unstable_mockModule("../../src/models/key_ratio.model.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/models/key_ratios_values.model.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

const key_ratio_schema = (await import("../../src/models/key_ratio.model.js")).default;
const ratio_values_schema = (await import("../../src/models/key_ratios_values.model.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { ratio_service } = await import("../../src/services/key_ratio.service.js");

// Helper to mock .find().lean()
const mock_find_lean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ select: jest.fn(() => ({ lean: lean_function })) });
  return { lean_function };
};

describe("ratio_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("No filters → returns empty array when values are empty", async () => {
    mock_find_lean(ratio_values_schema, []);
    const result = await ratio_service({});
    expect(ratio_values_schema.find).toHaveBeenCalledWith({});
    expect(result).toEqual([]);
  });

  test("Filters by keyratioid and applicationid → returns matched results", async () => {
    const filters = { keyratioid: "1", applicationid: "2" };

    const values_docs = [{ KeyRatioID: 1, ApplicationID: 2, FileID: 10, Value: 123 }];
    const key_docs = [{ KeyRatioID: 1, Metric: "Metric1", Unit: "Unit1", Category: "Cat1" }];

    mock_find_lean(ratio_values_schema, values_docs);
    mock_find_lean(key_ratio_schema, key_docs);
    get_period.mockResolvedValue(new Map([[10, 202510]]));

    const result = await ratio_service(filters);

    expect(ratio_values_schema.find).toHaveBeenCalledWith({ KeyRatioID: 1, ApplicationID: 2 });
    expect(key_ratio_schema.find).toHaveBeenCalledWith({ KeyRatioID: { $in: [1] } });
    expect(result.length).toBe(1);
    expect(result[0]).toMatchObject({
      KeyRatioID: 1,
      MetricName: "Metric1",
      Unit: "Unit1",
      Category: "Cat1",
      ApplicationID: 2,
      Timeline: 202510,
      Value: 123,
    });
  });

  test("Filters by metric → applies regex filter", async () => {
    const filters = { metric: "Metric1" };

    const values_docs = [{ KeyRatioID: 1, ApplicationID: 2, FileID: 11, Value: 456 }];
    const key_docs = [{ KeyRatioID: 1, Metric: "Metric1", Unit: "Unit1", Category: "Cat1" }];

    mock_find_lean(ratio_values_schema, values_docs);
    mock_find_lean(key_ratio_schema, key_docs);
    get_period.mockResolvedValue(new Map([[11, 202511]]));

    const result = await ratio_service(filters);

    expect(key_ratio_schema.find).toHaveBeenCalledWith({
      KeyRatioID: { $in: [1] },
      Metric: { $regex: "Metric1", $options: "i" },
    });
    expect(result[0].MetricName).toBe("Metric1");
  });

  test("Filters by unit → applies regex filter", async () => {
    const filters = { unit: "Unit1" };

    const values_docs = [{ KeyRatioID: 2, ApplicationID: 3, FileID: 12, Value: 789 }];
    const key_docs = [{ KeyRatioID: 2, Metric: "Metric2", Unit: "Unit1", Category: "Cat2" }];

    mock_find_lean(ratio_values_schema, values_docs);
    mock_find_lean(key_ratio_schema, key_docs);
    get_period.mockResolvedValue(new Map([[12, 202512]]));

    const result = await ratio_service(filters);

    expect(key_ratio_schema.find).toHaveBeenCalledWith({
      KeyRatioID: { $in: [2] },
      Unit: { $regex: "Unit1", $options: "i" },
    });
    expect(result[0].Unit).toBe("Unit1");
  });

  test("Multiple values → multiple FileIDs mapped by get_period", async () => {
    const filters = {};

    const values_docs = [
      { KeyRatioID: 1, ApplicationID: 2, FileID: 101, Value: 100 },
      { KeyRatioID: 2, ApplicationID: 3, FileID: 102, Value: 200 },
    ];
    const key_docs = [
      { KeyRatioID: 1, Metric: "Metric1", Unit: "U1", Category: "C1" },
      { KeyRatioID: 2, Metric: "Metric2", Unit: "U2", Category: "C2" },
    ];

    mock_find_lean(ratio_values_schema, values_docs);
    mock_find_lean(key_ratio_schema, key_docs);
    get_period.mockResolvedValue(
      new Map([
        [101, 202510],
        [102, 202511],
      ]),
    );

    const result = await ratio_service(filters);

    expect(result.length).toBe(2);
    expect(result[0].Timeline).toBe(202510);
    expect(result[1].Timeline).toBe(202511);
    expect(result[0].Value).toBe(100);
    expect(result[1].Value).toBe(200);
  });
});
