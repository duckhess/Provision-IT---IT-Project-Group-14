import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/covenants.service.js", () => ({
  filter_covenants: jest.fn(),
}));

jest.unstable_mockModule("../../src/services/key_ratio.service.js", () => ({
  ratio_service: jest.fn(),
}));

const { filter_covenants } = await import("../../src/services/covenants.service.js");
const { ratio_service } = await import("../../src/services/key_ratio.service.js");
const { derive_success_rates } = await import("../../src/services/category.service.js");

describe("derive_success_rates service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: computes_spot_and_avg_success_and_merges_by_category", async () => {
    const applicationid = "2";

    const covenant_rows = [
      { Category: "Liquidity", Analysis: true },
      { Category: "Liquidity", Analysis: false },
      { Category: "Leverage", Analysis: true },
    ];

    const ratio_rows = [
      { KeyRatioID: 1, Category: "Liquidity", Timeline: 1, Value: 5 },
      { KeyRatioID: 1, Category: "Liquidity", Timeline: 2, Value: 4 },
      { KeyRatioID: 2, Category: "Leverage", Timeline: 1, Value: 2 },
      { KeyRatioID: 2, Category: "Leverage", Timeline: 2, Value: 1 },
    ];

    filter_covenants.mockResolvedValue(covenant_rows);
    ratio_service.mockResolvedValue(ratio_rows);

    const result = await derive_success_rates({ applicationid });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("ApplicationID", Number(applicationid));

    expect(filter_covenants).toHaveBeenCalledWith({ applicationid });
    expect(ratio_service).toHaveBeenCalledWith({ applicationid });
  });

  test("negative_case: missing_applicationid_throws", async () => {
    await expect(derive_success_rates({})).rejects.toThrow("ApplicationID is required");
    expect(filter_covenants).not.toHaveBeenCalled();
    expect(ratio_service).not.toHaveBeenCalled();
  });

  test("edge_case: no_covenants_and_no_ratios_returns_empty", async () => {
    filter_covenants.mockResolvedValue([]);
    ratio_service.mockResolvedValue([]);

    const result = await derive_success_rates({ applicationid: "3" });

    expect(result).toEqual([]);
    expect(filter_covenants).toHaveBeenCalledWith({ applicationid: "3" });
    expect(ratio_service).toHaveBeenCalledWith({ applicationid: "3" });
  });
});
