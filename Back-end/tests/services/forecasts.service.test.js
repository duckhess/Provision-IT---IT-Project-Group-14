import { jest } from "@jest/globals";

// Mock models
jest.unstable_mockModule("../../src/models/forecast.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/models/forecast_values.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/models/forecast_forecasts.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

const forecast_schema = (await import("../../src/models/forecast.js")).default;
const forecast_values_schema = (await import("../../src/models/forecast_values.js")).default;
const forecast_forecasts_schema = (await import("../../src/models/forecast_forecasts.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { filter_forecasts } = await import("../../src/services/forecast.service.js");

// Helper to mock .find().lean()
const mock_find_lean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_function });
  return { lean_function };
};

describe("filter_forecasts service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Negative Test Case: no filters → returns empty array when collections are empty", async () => {
    mock_find_lean(forecast_schema, []);
    mock_find_lean(forecast_forecasts_schema, []);
    mock_find_lean(forecast_values_schema, []);
    get_period.mockResolvedValue(new Map());

    const result = await filter_forecasts({});

    expect(forecast_schema.find).toHaveBeenCalledTimes(1);
    expect(forecast_forecasts_schema.find).toHaveBeenCalledWith({});
    expect(forecast_values_schema.find).toHaveBeenCalledWith({ $or: [] });
    expect(result).toEqual([]);
  });

  test("Positive Test Case: filters forecasts by forecastid and applicationid", async () => {
    const filters = { forecastid: "1", applicationid: "2" };

    const documents = [{ ForecastID: 1, AccountDescription: "Revenue", Unit: "$" }];
    const forecasts = [
      {
        ForecastID: 1,
        ApplicationID: 2,
        "Avg Hist Forecast": "100.5",
        "Avg Hist % Change": 5,
        "Avg Hist % to Revenue": 10,
        "Avg Hist Ratio Expression": 2,
        "Cashflow Movement Avg Hist": "50",
        "User Forecast": "120",
        "User Forecast % Change": 20,
        "User Ratio Expression": 3,
        "Cashflow Movement User Forecast": "60",
      },
    ];
    const values = [{ ForecastID: 1, ApplicationID: 2, FileID: 99, Value: "200" }];

    mock_find_lean(forecast_schema, documents);
    mock_find_lean(forecast_forecasts_schema, forecasts);
    mock_find_lean(forecast_values_schema, values);
    get_period.mockResolvedValue(new Map([[99, 202510]]));

    const result = await filter_forecasts(filters);

    expect(forecast_forecasts_schema.find).toHaveBeenCalledWith({
      ForecastID: 1,
      ApplicationID: 2,
    });
    expect(result[0].Value).toBe(200);
    expect(result[0].Timeline).toBe(202510);
    expect(result[0].MetricName).toBe("Revenue");
  });

  test("FileID filter branch: fetches forecasts correctly by fileid", async () => {
    const filters = { fileid: "99" };

    mock_find_lean(forecast_schema, [{ ForecastID: 1, AccountDescription: "Revenue", Unit: "$" }]);
    mock_find_lean(forecast_forecasts_schema, [{ ForecastID: 1, ApplicationID: 2 }]);
    mock_find_lean(forecast_values_schema, [
      { ForecastID: 1, ApplicationID: 2, FileID: 99, Value: "123" },
    ]);
    get_period.mockResolvedValue(new Map([[99, 202510]]));

    const result = await filter_forecasts(filters);

    expect(forecast_forecasts_schema.find).toHaveBeenCalledWith({ FileID: 99 });
    expect(result[0].Value).toBe(123);
  });

  test("Multiple forecast values → multiple FileIDs mapped by get_period", async () => {
    const filters = {};

    const documents = [
      { ForecastID: 1, AccountDescription: "Revenue", Unit: "$" },
      { ForecastID: 2, AccountDescription: "Profit", Unit: "$" },
    ];
    const forecasts = [
      { ForecastID: 1, ApplicationID: 2, "Avg Hist Forecast": "100", "Avg Hist % Change": 5 },
      { ForecastID: 2, ApplicationID: 3, "Avg Hist Forecast": "200", "Avg Hist % Change": 10 },
    ];
    const values = [
      { ForecastID: 1, ApplicationID: 2, FileID: 99, Value: "1000" },
      { ForecastID: 2, ApplicationID: 3, FileID: 100, Value: "2000" },
    ];

    mock_find_lean(forecast_schema, documents);
    mock_find_lean(forecast_forecasts_schema, forecasts);
    mock_find_lean(forecast_values_schema, values);
    get_period.mockResolvedValue(
      new Map([
        [99, 202510],
        [100, 202511],
      ]),
    );

    const result = await filter_forecasts(filters);

    expect(result.length).toBe(2);
    expect(result[0].Timeline).toBe(202510);
    expect(result[1].Timeline).toBe(202511);
    expect(result[0].Value).toBe(1000);
    expect(result[1].Value).toBe(2000);
  });
});
