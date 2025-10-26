import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/financial_statements.service.js", () => ({
  filter_statements: jest.fn(),
}));

const { filter_statements } = await import("../../src/services/financial_statements.service.js");
const { fetch_statements } = await import(
  "../../src/controllers/financial_statements.controller.js"
);

// Helper: mock Express res
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_statements", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: returns filtered financial statements and lowercases keys", async () => {
    expect.assertions(2); // ensure Jest sees assertions

    const req = {
      query: {
        CompanyID: "1001",
        ApplicationID: "2",
        FileID: "3",
        Unit: "$",
      },
    };
    const res = make_res();

    const mock_data = [{ companyid: 1001, revenue: 12345 }];
    filter_statements.mockResolvedValue(mock_data);

    await fetch_statements(req, res);

    expect(filter_statements).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
      fileid: "3",
      unit: "$",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    // note: not asserting "not called" doesn't count against expect-expect
  });

  test("Negative: service throws → responds 500 with error", async () => {
    expect.assertions(2);

    const req = { query: { CompanyID: "1001" } };
    const res = make_res();

    filter_statements.mockRejectedValue(new Error("DB failure"));

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetch_statements(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
