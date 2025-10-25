import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/liability.service.js", () => ({
  liability_service: jest.fn(),
}));

const { liability_service } = await import("../../src/services/liability.service.js");
const { liability_controller } = await import("../../src/controllers/liability.controller.js");

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("liability_controller", () => {
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
    const res = make_res();

    const mock_data = [{ liabilityid: 5, metric: "Debt Ratio", value: 0.62 }];
    liability_service.mockResolvedValue(mock_data);

    await liability_controller(req, res);

    expect(liability_service).toHaveBeenCalledWith({
      metric: "Debt Ratio",
      unit: "%",
      liabilityid: "5",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500", async () => {
    const req = { query: { LiabilityID: "5" } };
    const res = make_res();

    liability_service.mockRejectedValue(new Error("DB failure"));

    await liability_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
