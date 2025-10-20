import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/statement_of_cashflows.service.js", () => ({
  socService: jest.fn(),
}));

const { socService } = await import("../../src/services/statement_of_cashflows.service.js");
const { socController } = await import("../../src/controllers/statement_of_cashflows.controller.js");

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
};

describe("socController (statement of cashflows)", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: returns SOC with lowercased filters", async () => {
    const req = { query: {
      Metric: "Operating Cash Flow",
      Unit: "$",
      CashFlowID: "4",
      ApplicationID: "2",
      FileID: "3",
    }};
    const res = makeRes();

    const mockData = [{ cashflowid: 4, metric: "Operating Cash Flow", value: 12000 }];
    socService.mockResolvedValue(mockData);

    await socController(req, res);

    expect(socService).toHaveBeenCalledWith({
      metric: "Operating Cash Flow",
      unit: "$",
      cashflowid: "4",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500", async () => {
    const req = { query: { CashFlowID: "4" } };
    const res = makeRes();

    socService.mockRejectedValue(new Error("DB failure"));

    await socController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
