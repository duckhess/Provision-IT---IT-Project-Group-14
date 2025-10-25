import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/liability.service.js", () => ({
  liabilityService: jest.fn(),
}));

const { liabilityService } = await import("../../src/services/liability.service.js");
const { liabilityController } = await import("../../src/controllers/liability.controller.js");

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("liabilityController", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: returns liabilities with lowercased filters", async () => {
    const req = {
      query: {
        Metric: "Debt Ratio",
        Unit: "%",
        LiabilityID: "5",
        ApplicationID: "2",
        FileID: "3",
      },
    };
    const res = makeRes();

    const mockData = [{ liabilityid: 5, metric: "Debt Ratio", value: 0.62 }];
    liabilityService.mockResolvedValue(mockData);

    await liabilityController(req, res);

    expect(liabilityService).toHaveBeenCalledWith({
      metric: "Debt Ratio",
      unit: "%",
      liabilityid: "5",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500", async () => {
    const req = { query: { LiabilityID: "5" } };
    const res = makeRes();

    liabilityService.mockRejectedValue(new Error("DB failure"));

    await liabilityController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
