import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/best_four_metrics.service.js", () => ({
  best_four_metrics_service: jest.fn(),
}));

const { best_four_metrics_service } = await import(
  "../../src/services/best_four_metrics.service.js"
);
const { best_metrics_controller } = await import(
  "../../src/controllers/best_four_metrics.controller.js"
);

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("best_metrics_controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: lowercases query keys and returns JSON", async () => {
    const req = {
      query: {
        companyID: "1001",
        applicationID: "2",
        metricID: "5",
      },
    };
    const res = make_res();

    const mock_data = [{ CompanyID: 1001, MetricID: 5 }];
    best_four_metrics_service.mockResolvedValue(mock_data);

    await best_metrics_controller(req, res);

    expect(best_four_metrics_service).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
      metricid: "5",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("negative: service throws → responds 500 with error", async () => {
    const req = { query: { companyID: "1001" } };
    const res = make_res();

    best_four_metrics_service.mockRejectedValue(new Error("DB down"));

    await best_metrics_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB down" });
  });
});
