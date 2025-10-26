// tests/routes/covenants.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/covenants.controller.js", () => ({
  fetch_covenants: jest.fn(),
}));

// Import after mocking
const { fetch_covenants } = await import("../../src/controllers/covenants.controller.js");
const covenants_routes = (await import("../../src/routes/covenants.routes.js")).default;

describe("covenants.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/covenants", covenants_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /covenants calls fetch_covenants and returns 200 with data", async () => {
    const mock_data = [
      { covenant_id: 1, name: "Covenant A" },
      { covenant_id: 2, name: "Covenant B" },
    ];
    fetch_covenants.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/covenants");

    expect(fetch_covenants).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: fetch_covenants throws error, returns 500", async () => {
    fetch_covenants.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/covenants");

    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
