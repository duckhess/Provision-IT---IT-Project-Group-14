import { jest } from "@jest/globals";

// --- Mock the service used by the controller ---
jest.unstable_mockModule("../../src/services/category.service.js", () => ({
  derive_success_rates: jest.fn(),
}));

// --- Imports after mocks ---
const { derive_success_rates } = await import("../../src/services/category.service.js");
const { fetch_success_rates } = await import("../../src/controllers/category.controller.js");

// --- Helper: express-like res stub with chaining ---
const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_success_rates controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive: forwards req.query as-is, returns 200 and JSON body", async () => {
    const req = {
      query: {
        applicationid: "2", // simulate HTTP query strings
        category: "Liquidity", // any extra filters should be forwarded unchanged
      },
    };
    const res = make_res();

    const mock_data = [
      {
        ApplicationID: 2,
        Category: "Liquidity",
        "Spot % Success": 50,
        "3 yr Average % Success": 100,
      },
    ];
    derive_success_rates.mockResolvedValue(mock_data);

    await fetch_success_rates(req, res);

    // service called with the exact req.query (HTTP-like)
    expect(derive_success_rates).toHaveBeenCalledWith(req.query);

    // controller explicitly sets status(200)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mock_data);
  });

  test("Negative: when service throws, responds 500 with error", async () => {
    const req = { query: { applicationid: "bad" } };
    const res = make_res();

    derive_success_rates.mockRejectedValue(new Error("ApplicationID is required"));

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetch_success_rates(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ApplicationID is required" });

    console_spy.mockRestore();
  });
});
