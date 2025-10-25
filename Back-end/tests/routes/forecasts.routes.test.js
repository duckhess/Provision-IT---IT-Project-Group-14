// tests/routes/forecast.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/forecast.controller.js", () => ({
  fetch_forecasts: jest.fn(),
}));

// Import after mocking
const { fetch_forecasts } = await import("../../src/controllers/forecast.controller.js");
const forecast_routes = (await import("../../src/routes/forecasts.routes.js")).default;

describe("forecast.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/forecast", forecast_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /forecast calls fetch_forecasts and returns 200 with data", async () => {
    const mock_data = [
      { forecast_id: 1, name: "Forecast A", value: 100 },
      { forecast_id: 2, name: "Forecast B", value: 200 }
    ];
    fetch_forecasts.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/forecast");

    expect(fetch_forecasts).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_forecasts throws error, returns 500", async () => {
    fetch_forecasts.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/forecast");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
