// tests/controllers/income_statement.controller.test.js
import { jest } from "@jest/globals";


jest.unstable_mockModule("../../src/services/income_statement.service.js", () => ({
  incomeService: jest.fn(),
}));


const { incomeService } = await import("../../src/services/income_statement.service.js");
const { incomeController } = await import("../../src/controllers/income_statement.controller.js");

// Minimal Express-like res mock
const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
};

describe("incomeController", () => {
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
    const res = makeRes();

    const mockData = [{ incomeid: 9, metric: "Net Profit Margin", value: 0.22 }];
    incomeService.mockResolvedValue(mockData);

    await incomeController(req, res);

    expect(incomeService).toHaveBeenCalledWith({
      metric: "Net Profit Margin",
      unit: "%",
      incomeid: "9",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500 + error message", async () => {
    const req = { query: { IncomeID: "9" } };
    const res = makeRes();

    incomeService.mockRejectedValue(new Error("DB failure"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await incomeController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    consoleSpy.mockRestore();
  });
});
