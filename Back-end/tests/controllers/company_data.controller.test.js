import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/company_data.service.js", () => ({
  company_data_service: jest.fn(),
}));

const { company_data_service } = await import("../../src/services/company_data.service.js");
const { data_controller } = await import("../../src/controllers/company_data.controller.js");

// Helper: mock Express res
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("data_controller (company data)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: calls service with lowercased filters and returns data", async () => {
    const req = {
      query: {
        CompanyID: "1001",
        ApplicationID: "2",
      },
    };
    const res = make_res();

    const mock_data = [{ CompanyID: 1001, ApplicationID: 2, name: "Cozy Nest" }];
    company_data_service.mockResolvedValue(mock_data);

    await data_controller(req, res);

    expect(company_data_service).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → responds 500 with error message", async () => {
    const req = { query: { CompanyID: "1001" } };
    const res = make_res();

    const err = new Error("Database connection failed");
    company_data_service.mockRejectedValue(err);

    await data_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database connection failed" });
  });
});
