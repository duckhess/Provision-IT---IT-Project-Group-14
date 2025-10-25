// tests/routes/equity.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/equity.controller.js", () => ({
  equity_controller: jest.fn(),
}));

// Import after mocking
const { equity_controller } = await import("../../src/controllers/equity.controller.js");
const equity_routes = (await import("../../src/routes/equity.routes.js")).default;

describe("equity.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/equity", equity_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /equity calls equity_controller and returns 200 with data", async () => {
    const mock_data = [
      { equity_id: 1, name: "Equity A", value: 100 },
      { equity_id: 2, name: "Equity B", value: 200 }
    ];
    equity_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/equity");

    expect(equity_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: equity_controller throws error, returns 500", async () => {
    equity_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/equity");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
