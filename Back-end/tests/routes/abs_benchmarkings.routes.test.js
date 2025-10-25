// tests/routes/abs_benchmarking.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/abs.controller.js", () => ({
  fetch_abs: jest.fn(),
}));

// Import after mocking
const { fetch_abs } = await import("../../src/controllers/abs.controller.js");
const abs_routes = (await import("../../src/routes/abs_benchmarkings.routes.js")).default;

describe("abs_benchmarkings.routes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/abs", abs_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /abs calls fetch_abs and returns 200 with data", async () => {
    const mock_data = [{ absid: 1, value: 42 }];
    fetch_abs.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app).get("/abs?ABSID=1");

    expect(fetch_abs).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_abs throws error, returns 500", async () => {
    fetch_abs.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app).get("/abs?ABSID=99");

    // Express should handle the error and return 500
    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
