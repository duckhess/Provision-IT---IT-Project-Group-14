// tests/routes/financial_statements.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/financial_statements.controller.js", () => ({
  fetch_statements: jest.fn(),
}));

// Import after mocking
const { fetch_statements } = await import(
  "../../src/controllers/financial_statements.controller.js"
);
const financial_statements_routes = (
  await import("../../src/routes/financial_statements.routes.js")
).default;

describe("financial_statements.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/financial-statements", financial_statements_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /financial-statements calls fetch_statements and returns 200 with data", async () => {
    const mock_data = [
      { statement_id: 1, type: "Balance Sheet", amount: 1000 },
      { statement_id: 2, type: "Income Statement", amount: 500 },
    ];
    fetch_statements.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/financial-statements");

    expect(fetch_statements).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_statements throws error, returns 500", async () => {
    fetch_statements.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/financial-statements");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
