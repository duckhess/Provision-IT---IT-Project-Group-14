// tests/routes/income_statement.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/income_statement.controller.js", () => ({
  income_controller: jest.fn(),
}));

// Import after mocking
const { income_controller } = await import("../../src/controllers/income_statement.controller.js");
const income_statement_routes = (await import("../../src/routes/income_statement.routes.js"))
  .default;

describe("income_statement.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/income-statement", income_statement_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /income-statement calls income_controller and returns 200 with data", async () => {
    const mock_data = [
      { statement_id: 1, type: "Income Statement", amount: 5000 },
      { statement_id: 2, type: "Income Statement", amount: 7000 },
    ];
    income_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/income-statement");

    expect(income_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: income_controller throws error, returns 500", async () => {
    income_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/income-statement");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
