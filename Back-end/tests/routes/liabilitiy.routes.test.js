// tests/routes/liability.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/liability.controller.js", () => ({
  liability_controller: jest.fn(),
}));

// Import after mocking
const { liability_controller } = await import("../../src/controllers/liability.controller.js");
const liability_routes = (await import("../../src/routes/liability.routes.js")).default;

describe("liability.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/liability", liability_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /liability calls liability_controller and returns 200 with data", async () => {
    const mock_data = [
      { liability_id: 1, name: "Short-term Debt", amount: 1000 },
      { liability_id: 2, name: "Long-term Debt", amount: 5000 }
    ];
    liability_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/liability");

    expect(liability_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: liability_controller throws error, returns 500", async () => {
    liability_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/liability");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
