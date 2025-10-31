// tests/routes/wcm.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/wcm.controller.js", () => ({
  fetch_wcm: jest.fn(),
}));

// Import after mocking
const { fetch_wcm } = await import("../../src/controllers/wcm.controller.js");
const wcm_routes = (await import("../../src/routes/working_capital_movements.routes.js")).default;

describe("wcm.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/wcm", wcm_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /wcm calls fetch_wcm and returns 200 with data", async () => {
    const mock_data = [
      { wcm_id: 1, name: "Metric A", value: 10 },
      { wcm_id: 2, name: "Metric B", value: 20 },
    ];
    fetch_wcm.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/wcm");

    expect(fetch_wcm).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_wcm throws error, returns 500", async () => {
    fetch_wcm.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/wcm");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
