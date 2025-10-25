import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/key_ratio.service.js", () => ({
  ratio_service: jest.fn(),
}));

const { ratio_service } = await import("../../src/services/key_ratio.service.js");
const { key_ratio_controller } = await import("../../src/controllers/key_ratio.controller.js");

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("key_ratio_controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: returns ratios with lowercased filters", async () => {
    const req = {
      query: {
        Metric: "Current Ratio",
        Unit: "x",
        KeyRatioID: "11",
        ApplicationID: "2",
        FileID: "3",
      },
    };
    const res = make_res();

    const mock_data = [{ keyratioid: 11, metric: "Current Ratio", value: 1.8 }];
    ratio_service.mockResolvedValue(mock_data);

    await key_ratio_controller(req, res);

    expect(ratio_service).toHaveBeenCalledWith({
      metric: "Current Ratio",
      unit: "x",
      keyratioid: "11",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500", async () => {
    const req = { query: { KeyRatioID: "11" } };
    const res = make_res();

    ratio_service.mockRejectedValue(new Error("DB failure"));

    await key_ratio_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
