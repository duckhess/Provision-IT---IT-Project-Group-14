// tests/routes/company.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/company.controller.js", () => ({
  list_companies_controller: jest.fn(),
}));

// Import after mocking
const { list_companies_controller } = await import("../../src/controllers/company.controller.js");
const company_routes = (await import("../../src/routes/company.routes.js")).default;

describe("company.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/company", company_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /company calls list_companies_controller and returns 200 with data", async () => {
    const mock_data = [
      { company_id: 1, name: "OpenAI" },
      { company_id: 2, name: "Example Corp" },
    ];
    list_companies_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/company");

    expect(list_companies_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: list_companies_controller throws error, returns 500", async () => {
    list_companies_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/company");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
