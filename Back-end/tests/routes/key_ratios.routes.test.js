// tests/routes/key_ratio.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/key_ratio.controller.js", () => ({
  key_ratio_controller: jest.fn(),
}));

// Import after mocking
const { key_ratio_controller } = await import("../../src/controllers/key_ratio.controller.js");
const key_ratio_routes = (await import("../../src/routes/key_ratio.routes.js")).default;

describe("key_ratio.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/key-ratio", key_ratio_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /key-ratio calls key_ratio_controller and returns 200 with data", async () => {
    const mock_data = [
      { ratio_id: 1, name: "Debt to Equity", value: 1.5 },
      { ratio_id: 2, name: "Current Ratio", value: 2.0 },
    ];
    key_ratio_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/key-ratio");

    expect(key_ratio_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: key_ratio_controller throws error, returns 500", async () => {
    key_ratio_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/key-ratio");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
