// tests/controllers/company.controller.test.js
import { jest } from "@jest/globals";

// 1) Mock the service BEFORE importing the controller
jest.unstable_mockModule("../../src/services/company.service.js", () => ({
  list_companies_service: jest.fn(),
}));

// 2) Import the mocked service and the controller under test
const { list_companies_service } = await import("../../src/services/company.service.js");
const { list_companies_controller } = await import("../../src/controllers/company.controller.js");

// Minimal Express-like response mock
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res); // enable chaining
  res.json = jest.fn(() => res);
  return res;
};

describe("list_companies_controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: returns companies as JSON", async () => {
    const req = {}; // no query/body needed
    const res = make_res();

    const mock_data = [
      { CompanyID: 1001, name: "Cozy Nest Home Essentials" },
      { CompanyID: 1002, name: "Summit Sage Properties" },
    ];
    list_companies_service.mockResolvedValue(mock_data);

    await list_companies_controller(req, res);

    expect(list_companies_service).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("negative: service throws → responds 500 with error", async () => {
    const req = {};
    const res = make_res();

    list_companies_service.mockRejectedValue(new Error("DB failure"));

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await list_companies_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
