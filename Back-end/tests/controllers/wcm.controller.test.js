import { jest } from "@jest/globals";


jest.unstable_mockModule("../../src/services/wcm.service.js", () => ({
  filter_wcm: jest.fn(),
}));

const { filter_wcm } = await import("../../src/services/wcm.service.js");
const { fetch_wcm }  = await import("../../src/controllers/wcm.controller.js");

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
};

describe("fetch_wcm controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: returns filtered docs and lowercases query keys", async () => {
    const req = {
      query: {
        CompanyID: "1001",
        ApplicationID: "2",
        FileID: "3",
        Unit: "$",
      },
    };
    const res = makeRes();

    const mockData = [{ companyid: 1001, metric: "NWC", value: 4200 }];
    filter_wcm.mockResolvedValue(mockData);

    await fetch_wcm(req, res);

    expect(filter_wcm).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
      fileid: "3",
      unit: "$",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → responds 500 with error message", async () => {
    const req = { query: { CompanyID: "1001" } };
    const res = makeRes();

    filter_wcm.mockRejectedValue(new Error("DB failure"));

    await fetch_wcm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
