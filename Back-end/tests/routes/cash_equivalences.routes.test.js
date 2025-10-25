// tests/routes/cash_equivalences.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/cash_equivalences.controller.js", () => ({
  fetch_cash_equivalences: jest.fn(),
}));

// Import after mocking
const { fetch_cash_equivalences } = await import("../../src/controllers/cash_equivalences.controller.js");
const cash_equivalences_routes = (await import("../../src/routes/cash_equivalences.routes.js")).default;

describe("cash_equivalences.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/cash-equivalences", cash_equivalences_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /cash-equivalences calls fetch_cash_equivalences and returns 200 with data", async () => {
    const mock_data = [{ id: 1, name: "Cash Item A", value: 1000 }];
    fetch_cash_equivalences.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/cash-equivalences");

    expect(fetch_cash_equivalences).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_cash_equivalences throws error, returns 500", async () => {
    fetch_cash_equivalences.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/cash-equivalences");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
