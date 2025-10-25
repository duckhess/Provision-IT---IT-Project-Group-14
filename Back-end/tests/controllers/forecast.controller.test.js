import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/services/forecast.service.js", () => ({
  filter_forecasts: jest.fn(),
}));

// --- Imports after mocks ---
const { filter_forecasts } = await import("../../src/services/forecast.service.js");
const { fetch_forecasts } = await import("../../src/controllers/forecast.controller.js");

// --- Helper ---
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_forecasts controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: returns_filtered_documents_and_lowercases_query_keys", async () => {
    const req = {
      query: {
        ForecastID: "10",
        ApplicationID: "2",
        Type: "Financial",
      },
    };
    const res = make_res();

    const mock_data = [{ forecastid: 10, type: "Financial", applicationid: 2 }];
    filter_forecasts.mockResolvedValue(mock_data);

    await fetch_forecasts(req, res);

    expect(filter_forecasts).toHaveBeenCalledWith({
      forecastid: "10",
      applicationid: "2",
      type: "Financial",
    });

    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("negative_case: service_throws_error_responds_500", async () => {
    const req = { query: { ForecastID: "10" } };
    const res = make_res();

    const error = new Error("DB failure");
    filter_forecasts.mockRejectedValue(error);

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetch_forecasts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
