// tests/controllers/equity.controller.test.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/equity.service.js", () => ({
  equityService: jest.fn(),
}));

const { equityService } = await import("../../src/services/equity.service.js");
const { equityController } = await import("../../src/controllers/equity.controller.js");

// Helper: mock Express res
const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("equityController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: returns equities and lowercases query keys", async () => {
    const req = {
      query: {
        Metric: "Equity Ratio",
        Unit: "%",
        EquityID: "7",
        ApplicationID: "2",
        FileID: "3",
      },
    };
    const res = makeRes();

    const mockData = [{ equityid: 7, metric: "Equity Ratio", value: 0.45 }];
    equityService.mockResolvedValue(mockData);

    await equityController(req, res);

    expect(equityService).toHaveBeenCalledWith({
      metric: "Equity Ratio",
      unit: "%",
      equityid: "7",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → responds 500 with error", async () => {
    const req = { query: { EquityID: "7" } };
    const res = makeRes();

    equityService.mockRejectedValue(new Error("DB failure"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await equityController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    consoleSpy.mockRestore();
  });
});
