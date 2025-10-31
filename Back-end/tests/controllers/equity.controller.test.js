import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/equity.service.js", () => ({
  equity_service: jest.fn(),
}));

const { equity_service } = await import("../../src/services/equity.service.js");
const { equity_controller } = await import("../../src/controllers/equity.controller.js");

// Helper: mock Express res
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("equity_controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: returns equities and lowercases query keys", async () => {
    expect.assertions(2);

    const req = {
      query: {
        Metric: "Equity Ratio",
        Unit: "%",
        EquityID: "7",
        ApplicationID: "2",
        FileID: "3",
      },
    };
    const res = make_res();

    const mock_data = [{ equityid: 7, metric: "Equity Ratio", value: 0.45 }];
    equity_service.mockResolvedValue(mock_data);

    await equity_controller(req, res);

    expect(equity_service).toHaveBeenCalledWith({
      metric: "Equity Ratio",
      unit: "%",
      equityid: "7",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
  });

  test("negative: service throws → responds 500 with error", async () => {
    expect.assertions(2);

    const req = { query: { EquityID: "7" } };
    const res = make_res();

    equity_service.mockRejectedValue(new Error("DB failure"));

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await equity_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
