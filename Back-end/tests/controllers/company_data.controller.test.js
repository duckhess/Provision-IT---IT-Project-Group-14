// tests/controllers/company_data.controller.test.js
import { jest } from "@jest/globals";


jest.unstable_mockModule("../../src/services/company_data.service.js", () => ({
  companyDataService: jest.fn(),
}));


const { companyDataService } = await import("../../src/services/company_data.service.js");
const { dataController } = await import("../../src/controllers/company_data.controller.js");

// Helper: mock Express res
const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json  = jest.fn(() => res);
  return res;
};

describe("dataController (company data)", () => {
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
    const res = makeRes();

    const mockData = [{ CompanyID: 1001, ApplicationID: 2, name: "Cozy Nest" }];
    companyDataService.mockResolvedValue(mockData);

    await dataController(req, res);

    expect(companyDataService).toHaveBeenCalledWith({
      companyid: "1001",
      applicationid: "2",
    });
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Negative: service throws → responds 500 with error message", async () => {
    const req = { query: { CompanyID: "1001" } };
    const res = makeRes();

    const err = new Error("Database connection failed");
    companyDataService.mockRejectedValue(err);

    await dataController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database connection failed" });
  });
});
