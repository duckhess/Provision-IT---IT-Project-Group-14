import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/statement_of_cashflows.service.js", () => ({
  soc_service: jest.fn(),
}));

const { soc_service } = await import("../../src/services/statement_of_cashflows.service.js");
const { soc_controller } = await import(
  "../../src/controllers/statement_of_cashflows.controller.js"
);

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("soc_controller (statement of cashflows)", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: returns SOC with lowercased filters", async () => {
    const req = {
      query: {
        Metric: "Operating Cash Flow",
        Unit: "$",
        CashFlowID: "4",
        ApplicationID: "2",
        FileID: "3",
      },
    };
    const res = make_res();

    const mock_data = [{ cashflowid: 4, metric: "Operating Cash Flow", value: 12000 }];
    soc_service.mockResolvedValue(mock_data);

    await soc_controller(req, res);

    expect(soc_service).toHaveBeenCalledWith({
      metric: "Operating Cash Flow",
      unit: "$",
      cashflowid: "4",
      applicationid: "2",
      fileid: "3",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → 500", async () => {
    const req = { query: { CashFlowID: "4" } };
    const res = make_res();

    soc_service.mockRejectedValue(new Error("DB failure"));

    await soc_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
