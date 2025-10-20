// tests/controllers/industry.controller.test.js
import { jest } from "@jest/globals";


jest.unstable_mockModule("../../src/services/industry.service.js", () => ({
  list_industries_service: jest.fn(),
  get_industry_by_id_service: jest.fn(),
}));


const {
  list_industries_service,
  get_industry_by_id_service,
} = await import("../../src/services/industry.service.js");
const { list_industries_controller } = await import("../../src/controllers/industry.controller.js");

// Minimal Express-like res mock
const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
};

describe("list_industries_controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Positive: no IndustryID → returns full list", async () => {
    const req = { query: {} };
    const res = makeRes();

    const mockList = [{ id: 1, name: "Real Estate" }, { id: 2, name: "Manufacturing" }];
    list_industries_service.mockResolvedValue(mockList);

    await list_industries_controller(req, res);

    expect(list_industries_service).toHaveBeenCalledTimes(1);
    expect(get_industry_by_id_service).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockList);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Positive: valid IndustryID → returns single item", async () => {
    const req = { query: { IndustryID: "3" } };
    const res = makeRes();

    const item = { id: 3, name: "Healthcare" };
    get_industry_by_id_service.mockResolvedValue(item);

    await list_industries_controller(req, res);

    expect(get_industry_by_id_service).toHaveBeenCalledWith(3);
    expect(res.json).toHaveBeenCalledWith(item);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("404: valid IndustryID but not found", async () => {
    const req = { query: { IndustryID: "99" } };
    const res = makeRes();

    get_industry_by_id_service.mockResolvedValue(null);

    await list_industries_controller(req, res);

    expect(get_industry_by_id_service).toHaveBeenCalledWith(99);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  test("400: IndustryID is not a number", async () => {
    const req = { query: { IndustryID: "abc" } };
    const res = makeRes();

    await list_industries_controller(req, res);

    expect(list_industries_service).not.toHaveBeenCalled();
    expect(get_industry_by_id_service).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Industry ID must be a number" });
  });

  test("500: service throws (list path)", async () => {
    const req = { query: {} };
    const res = makeRes();

    list_industries_service.mockRejectedValue(new Error("DB failure"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await list_industries_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    consoleSpy.mockRestore();
  });
});
