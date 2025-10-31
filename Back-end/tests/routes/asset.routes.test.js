// tests/routes/asset.routes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the controller
jest.unstable_mockModule("../../src/controllers/asset.controller.js", () => ({
  asset_controller: jest.fn(),
}));

// Import after mocking
const { asset_controller } = await import("../../src/controllers/asset.controller.js");
const asset_routes = (await import("../../src/routes/asset.routes.js")).default;

describe("asset.routes", () => {
  let app_instance;

  beforeAll(() => {
    app_instance = express();
    app_instance.use(express.json());
    app_instance.use("/asset", asset_routes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: GET /asset calls asset_controller and returns 200 with data", async () => {
    const mock_data = [{ asset_id: 1, name: "Asset A" }];
    asset_controller.mockImplementation((req, res) => res.json(mock_data));

    const res = await request(app_instance).get("/asset");

    expect(asset_controller).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock_data);
  });

  test("Negative: asset_controller throws error, returns 500", async () => {
    asset_controller.mockImplementation(() => {
      throw new Error("Controller error");
    });

    const res = await request(app_instance).get("/asset");

    // Express should handle the error and return 500
    expect(res.status).toBe(500);
    expect(res.text).toMatch(/Error|Internal Server Error/i);
  });
});
