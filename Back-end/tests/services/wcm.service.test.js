import { jest } from "@jest/globals";

// Mock the models and timeline service
jest.unstable_mockModule("../../src/models/working_capital_movements.model.js", () => ({
  default: { find: jest.fn() },
}));

jest.unstable_mockModule("../../src/models/wcm_values.model.js", () => ({
  default: { find: jest.fn() },
}));

jest.unstable_mockModule("../../src/models/wcm_forecasts.model.js", () => ({
  default: { find: jest.fn() },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

const wcm_schema = (await import("../../src/models/working_capital_movements.model.js")).default;
const wcm_values_schema = (await import("../../src/models/wcm_values.model.js")).default;
const wcm_forecasts_schema = (await import("../../src/models/wcm_forecasts.model.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { filter_wcm } = await import("../../src/services/wcm.service.js");

// Helper to mock .find().lean()
const mockFindLean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_function });
  return { lean_function };
};

describe("wcm.service filter_wcm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------
  // Negative Test Cases
  // ------------------

  test("Negative: No filters → returns empty array if no forecasts", async () => {
    mockFindLean(wcm_schema, []);
    mockFindLean(wcm_forecasts_schema, []);
    mockFindLean(wcm_values_schema, []);
    get_period.mockResolvedValue(new Map());

    const result = await filter_wcm({});
    expect(result).toEqual([]);
  });

  test("Negative: Forecast exists but no values → returns NaN for Value and undefined Timeline", async () => {
    const forecast_data = [{ CapitalID: 1, ApplicationID: 10, "Avg Historical Forecast": 100, "User Forecast": 200 }];
    mockFindLean(wcm_schema, [{ CapitalID: 1, Metric: "Cash", Unit: "USD" }]);
    mockFindLean(wcm_forecasts_schema, forecast_data);
    mockFindLean(wcm_values_schema, []);
    get_period.mockResolvedValue(new Map());

    const result = await filter_wcm({});
    expect(result[0].Value).toBeNaN();
    expect(result[0].Timeline).toBeUndefined();
  });

  // ------------------
  // Positive Test Cases
  // ------------------

  test("Positive: Single forecast with matching value → returns full mapped object", async () => {
    const movements = [{ CapitalID: 1, Metric: "Cash", Unit: "USD" }];
    const forecasts = [{ CapitalID: 1, ApplicationID: 10, "Avg Historical Forecast": 100, "User Forecast": 200 }];
    const values = [{ CapitalID: 1, ApplicationID: 10, FileID: 5, Value: 123 }];
    const timeline_map = new Map([[5, 202510]]);

    mockFindLean(wcm_schema, movements);
    mockFindLean(wcm_forecasts_schema, forecasts);
    mockFindLean(wcm_values_schema, values);
    get_period.mockResolvedValue(timeline_map);

    const result = await filter_wcm({});
    expect(result).toEqual([
      {
        CapitalID: 1,
        MetricName: "Cash",
        Unit: "USD",
        ApplicationID: 10,
        Timeline: 202510,
        Value: 123,
        "Avg Historical Forecast": 100,
        "User Forecast": 200,
      },
    ]);
  });

  test("Positive: Multiple forecasts → returns correct array", async () => {
    const movements = [
      { CapitalID: 1, Metric: "Cash", Unit: "USD" },
      { CapitalID: 2, Metric: "Inventory", Unit: "USD" },
    ];
    const forecasts = [
      { CapitalID: 1, ApplicationID: 10, "Avg Historical Forecast": 100, "User Forecast": 200 },
      { CapitalID: 2, ApplicationID: 20, "Avg Historical Forecast": 300, "User Forecast": 400 },
    ];
    const values = [
      { CapitalID: 1, ApplicationID: 10, FileID: 5, Value: 123 },
      { CapitalID: 2, ApplicationID: 20, FileID: 6, Value: 456 },
    ];
    const timeline_map = new Map([
      [5, 202510],
      [6, 202511],
    ]);

    mockFindLean(wcm_schema, movements);
    mockFindLean(wcm_forecasts_schema, forecasts);
    mockFindLean(wcm_values_schema, values);
    get_period.mockResolvedValue(timeline_map);

    const result = await filter_wcm({});
    expect(result.length).toBe(2);
    expect(result[0].Value).toBe(123);
    expect(result[1].Value).toBe(456);
  });

  // ------------------
  // Branch coverage for filters
  // ------------------

  test("Positive: Filters applied → hits all filter branches", async () => {
    const movements = [{ CapitalID: 1, Metric: "Cash", Unit: "USD" }];
    const forecasts = [{ CapitalID: 1, ApplicationID: 10, "Avg Historical Forecast": 100, "User Forecast": 200 }];
    const values = [{ CapitalID: 1, ApplicationID: 10, FileID: 5, Value: 123 }];
    const timeline_map = new Map([[5, 202510]]);

    mockFindLean(wcm_schema, movements);
    mockFindLean(wcm_forecasts_schema, forecasts);
    mockFindLean(wcm_values_schema, values);
    get_period.mockResolvedValue(timeline_map);

    const result = await filter_wcm({ capitalid: 1, applicationid: 10, fileid: 5 });
    expect(wcm_forecasts_schema.find).toHaveBeenCalledWith({
      CapitalID: 1,
      ApplicationID: 10,
      FileID: 5,
    });
    expect(result[0].CapitalID).toBe(1);
  });
});
