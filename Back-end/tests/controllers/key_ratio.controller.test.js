import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/key_ratio.service.js", () => ({
  ratioService: jest.fn(),
}));

const { ratioService } = await import("../../src/services/key_ratio.service.js");
const { keyRatioController } = await import("../../src/controllers/key_ratio.controller.js");

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
};

describe("keyRatioController", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: returns ratios with lowercased filters", async () => {
    const req = { query: {
      Metric: "Current Ratio",
      Unit: "x",
      KeyRatioID: "11",
      ApplicationID: "2",
      FileID: "3",
    }};
    const res = makeRes();

    const mockData = [{ keyratioid: 11, metric: "Current Ratio", value: 1.8 }];
    ratioService.mockResolvedValue(mockData);

    await keyRatioController(req, res);

    expect(ratioService).toHaveBeenCalledWith({
      metric: "Current Ratio",
      unit: "x",
      keyratioid: "11",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500", async () => {
    const req = { query: { KeyRatioID: "11" } };
    const res = makeRes();

    ratioService.mockRejectedValue(new Error("DB failure"));

    await keyRatioController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    // after fixing controller catch to use { error: err.message }
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
