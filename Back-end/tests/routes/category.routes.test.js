// tests/routes/success_rate.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/category.controller.js", () => ({
  fetch_success_rates: jest.fn(),
}));

// Import after mocking
const { fetch_success_rates } = await import("../../src/controllers/category.controller.js");
const success_rate_routes = (await import("../../src/routes/category.routes.js")).default;

describe("success_rate.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/api/success-rate", success_rate_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /api/success-rate calls fetch_success_rates and returns 200 with data", async () => {
    const mock_data = [{ application_id: 123, success_rate: 0.85 }];
    fetch_success_rates.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/api/success-rate?applicationid=123");

    expect(fetch_success_rates).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_success_rates throws error, returns 500", async () => {
    fetch_success_rates.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/api/success-rate?applicationid=999");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
