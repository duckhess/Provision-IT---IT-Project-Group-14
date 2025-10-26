// tests/controllers/covenants.controller.test.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/covenants.service.js", () => ({
  filter_covenants: jest.fn(),
}));

const { filter_covenants } = await import("../../src/services/covenants.service.js");
const { fetch_covenants } = await import("../../src/controllers/covenants.controller.js");

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_covenants controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: returns filtered documents and lowercases query keys", async () => {
    const req = {
      query: {
        CovenantID: "10",
        CompanyID: "2001",
        Active: "true",
      },
    };
    const res = make_res();

    const mock_data = [{ covenantid: 10, companyid: 2001, active: true }];
    filter_covenants.mockResolvedValue(mock_data);

    await fetch_covenants(req, res);

    expect(filter_covenants).toHaveBeenCalledWith({
      covenantid: "10",
      companyid: "2001",
      active: "true",
    });

    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws error, responds 500", async () => {
    const req = { query: { CovenantID: "10" } };
    const res = make_res();

    const error = new Error("DB failure");
    filter_covenants.mockRejectedValue(error);

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetch_covenants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
