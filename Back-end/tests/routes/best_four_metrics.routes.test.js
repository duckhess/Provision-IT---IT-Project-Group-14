// tests/routes/best_four_metrics.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/best_four_metrics.controller.js", () => ({
  best_metrics_controller: jest.fn(),
}));

// Import after mocking
const { best_metrics_controller } = await import(
  "../../src/controllers/best_four_metrics.controller.js"
);
const best_four_metrics_routes = (await import("../../src/routes/best_four_metrics.routes.js"))
  .default;

describe("best_four_metrics.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/best-metrics", best_four_metrics_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /best-metrics calls best_metrics_controller and returns 200 with data", async () => {
    const mock_data = [{ metric_id: 1, value: 99.5 }];
    best_metrics_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/best-metrics");

    expect(best_metrics_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: best_metrics_controller throws error, returns 500", async () => {
    best_metrics_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/best-metrics");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
