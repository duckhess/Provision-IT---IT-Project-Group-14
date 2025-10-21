// tests/controllers/cash_equivalences.controller.test.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/cash_service.js", () => ({
  filter_cash_equivalences: jest.fn(),
}));

const { filter_cash_equivalences } = await import("../../src/services/cash_service.js");
const { fetch_cash_equivalences } = await import("../../src/controllers/cash_equivalences.controller.js");


const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json  = jest.fn(() => res);
  return res;
};

describe("fetch_cash_equivalences controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: returns filtered documents and lowercases query keys", async () => {
    const req = {
      query: {
        CompanyID: "1002",
        ApplicationID: "2",
        FileID: "3",
        Unit: "$",
      },
    };
    const res = makeRes();

    const mockData = [{ companyid: 1002, value: 500 }];
    filter_cash_equivalences.mockResolvedValue(mockData);

    await fetch_cash_equivalences(req, res);

    expect(filter_cash_equivalences).toHaveBeenCalledWith({
      companyid: "1002",
      applicationid: "2",
      fileid: "3",
      unit: "$",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → responds 500 with error message", async () => {
    const req = { query: { CompanyID: "1002" } };
    const res = makeRes();

    const err = new Error("DB failure");
    filter_cash_equivalences.mockRejectedValue(err);

    await fetch_cash_equivalences(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
