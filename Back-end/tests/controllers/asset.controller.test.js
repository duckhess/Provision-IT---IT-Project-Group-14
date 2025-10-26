// tests/controllers/asset.controller.test.js
import { jest } from "@jest/globals";


jest.unstable_mockModule("../../src/services/asset.service.js", () => ({
  assetService: jest.fn(), 
}));

const { assetService } = await import("../../src/services/asset.service.js");
const { assetController } = await import("../../src/controllers/asset.controllers.js"); // <-- plural

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("assetController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: returns JSON and passes lower-cased filters", async () => {
    const req = {
      query: {
        AssetsID: "1",
        Unit: "$",
        ApplicationID: "2",
        FileID: "3",
        AccountDescription: "Cash and equivalents",
      },
    };
    const res = makeRes();

    const mockData = [{ AssetsID: 1, MetricName: "Test Metric", Value: 123 }];
    assetService.mockResolvedValue(mockData);

    await assetController(req, res);

    expect(assetService).toHaveBeenCalledWith({
      assetsid: "1",
      unit: "$",
      applicationid: "2",
      fileid: "3",
      accountdescription: "Cash and equivalents",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: when service throws, responds 500 with error", async () => {
    const req = { query: { AssetsID: "1" } };
    const res = makeRes();

    assetService.mockRejectedValue(new Error("DB down"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await assetController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB down" });

    consoleSpy.mockRestore();
  });
});
