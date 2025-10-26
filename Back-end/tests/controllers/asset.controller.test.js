import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/asset.service.js", () => ({
  asset_service: jest.fn(),
}));

const { asset_service } = await import("../../src/services/asset.service.js");
const { asset_controller } = await import("../../src/controllers/asset.controller.js");

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("asset_controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: returns JSON and passes lower-cased filters", async () => {
    const req = {
      query: {
        assetsid: "1",
        unit: "$",
        applicationid: "2",
        fileid: "3",
        accountdescription: "Cash and equivalents",
      },
    };
    const res = make_res();

    const mock_data = [{ assets_id: 1, metric_name: "Test Metric", value: 123 }];
    asset_service.mockResolvedValue(mock_data);

    await asset_controller(req, res);

    expect(asset_service).toHaveBeenCalledWith({
      assetsid: "1",
      unit: "$",
      applicationid: "2",
      fileid: "3",
      accountdescription: "Cash and equivalents",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("negative: when service throws, responds 500 with error", async () => {
    const req = { query: { assets_id: "1" } };
    const res = make_res();

    asset_service.mockRejectedValue(new Error("DB down")); // ✅

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {}); // ✅

    await asset_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB down" });

    console_spy.mockRestore();
  });
});
