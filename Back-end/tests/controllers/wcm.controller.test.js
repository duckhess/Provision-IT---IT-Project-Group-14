import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/wcm.service.js", () => ({
  filter_wcm: jest.fn(),
}));

const { filter_wcm } = await import("../../src/services/wcm.service.js");
const { fetch_wcm } = await import("../../src/controllers/wcm.controller.js");

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
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
    const res = make_res();

    const mock_data = [{ companyid: 1001, metric: "NWC", value: 4200 }];
    filter_wcm.mockResolvedValue(mock_data);

    await fetch_wcm(req, res);

    expect(filter_wcm).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
      fileid: "3",
      unit: "$",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → responds 500 with error message", async () => {
    const req = { query: { CompanyID: "1001" } };
    const res = make_res();

    filter_wcm.mockRejectedValue(new Error("DB failure"));

    await fetch_wcm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
