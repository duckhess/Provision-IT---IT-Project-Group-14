import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/income_statement.service.js", () => ({
  income_service: jest.fn(),
}));

const { income_service } = await import("../../src/services/income_statement.service.js");
const { income_controller } = await import("../../src/controllers/income_statement.controller.js");

// Minimal Express-like res mock
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("income_controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: passes lowercased filters and returns JSON", async () => {
    const req = {
      query: {
        Metric: "Net Profit Margin",
        Unit: "%",
        IncomeID: "9",
        ApplicationID: "2",
        FileID: "3",
      },
    };
    const res = make_res();

    const mock_data = [{ incomeid: 9, metric: "Net Profit Margin", value: 0.22 }];
    income_service.mockResolvedValue(mock_data);

    await income_controller(req, res);

    expect(income_service).toHaveBeenCalledWith({
      metric: "Net Profit Margin",
      unit: "%",
      incomeid: "9",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500 + error message", async () => {
    const req = { query: { IncomeID: "9" } };
    const res = make_res();

    income_service.mockRejectedValue(new Error("DB failure"));
    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await income_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
