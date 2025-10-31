// tests/routes/company_data.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/company_data.controller.js", () => ({
  data_controller: jest.fn(),
}));

// Import after mocking
const { data_controller } = await import("../../src/controllers/company_data.controller.js");
const company_data_routes = (await import("../../src/routes/company_data.routes.js")).default;

describe("company_data.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/company-data", company_data_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /company-data calls data_controller and returns 200 with data", async () => {
    const mock_data = [{ company_id: 1, name: "OpenAI", revenue: 5000000 }];
    data_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/company-data");

    expect(data_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: data_controller throws error, returns 500", async () => {
    data_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/company-data");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
