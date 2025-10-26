// tests/routes/industry.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/industry.controller.js", () => ({
  list_industries_controller: jest.fn(),
}));

// Import after mocking
const { list_industries_controller } = await import("../../src/controllers/industry.controller.js");
const industry_routes = (await import("../../src/routes/industry.routes.js")).default;

describe("industry.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/industry", industry_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /industry calls list_industries_controller and returns 200 with data", async () => {
    const mock_data = [
      { industry_id: 1, name: "Technology" },
      { industry_id: 2, name: "Finance" },
    ];
    list_industries_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/industry");

    expect(list_industries_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: list_industries_controller throws error, returns 500", async () => {
    list_industries_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/industry");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
