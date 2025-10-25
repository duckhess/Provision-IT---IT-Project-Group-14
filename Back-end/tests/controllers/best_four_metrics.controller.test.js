// tests/controllers/best_four_metrics.controller.test.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/best_four_metrics.service.js", () => ({
  best4MetricsService: jest.fn(),
}));

const { best4MetricsService } = await import("../../src/services/best_four_metrics.service.js");
const { bestMetricsController } = await import(
  "../../src/controllers/best_four_metrics.controller.js"
);

// Helper: mock Express response object
const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("bestMetricsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: returns data from service", async () => {
    const req = {
      query: { CompanyID: "1001", ApplicationID: "2", MetricID: "5" },
    };
    const res = makeRes();

    const mockData = [{ CompanyID: 1001, Metric: "Return on Assets", Value: 0.15 }];
    best4MetricsService.mockResolvedValue(mockData);

    await bestMetricsController(req, res);

    expect(best4MetricsService).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
      metricid: "5",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: handles service error gracefully", async () => {
    const req = { query: { CompanyID: "1001" } };
    const res = makeRes();

    const error = new Error("Database connection failed");
    best4MetricsService.mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await bestMetricsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database connection failed" });

    consoleSpy.mockRestore();
  });
});
