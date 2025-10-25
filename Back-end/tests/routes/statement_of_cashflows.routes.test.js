// tests/routes/statement_of_cashflows.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/statement_of_cashflows.controller.js", () => ({
  soc_controller: jest.fn(),
}));

// Import after mocking
const { soc_controller } = await import("../../src/controllers/statement_of_cashflows.controller.js");
const soc_routes = (await import("../../src/routes/statement_of_cashflows.routes.js")).default;

describe("statement_of_cashflows.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/statement-of-cashflows", soc_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /statement-of-cashflows calls soc_controller and returns 200 with data", async () => {
    const mock_data = [
      { soc_id: 1, type: "Operating", amount: 2000 },
      { soc_id: 2, type: "Investing", amount: -500 }
    ];
    soc_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/statement-of-cashflows");

    expect(soc_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: soc_controller throws error, returns 500", async () => {
    soc_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/statement-of-cashflows");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
