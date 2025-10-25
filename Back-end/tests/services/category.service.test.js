// __tests__/success_rate_service.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/services/covenants.service.js", () => ({
  filter_covenants: jest.fn(),
}));

jest.unstable_mockModule("../../src/services/key_ratio.service.js", () => ({
  ratioService: jest.fn(),
}));

// --- Imports after mocks ---
const { filter_covenants } = await import("../../src/services/covenants.service.js");
const { ratioService: ratio_service } = await import("../../src/services/key_ratio.service.js");
const { derive_success_rates } = await import("../../src/services/category.service.js");

describe("derive_success_rates service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: computes_spot_and_avg_success_and_merges_by_category", async () => {
    const applicationid = "2";

    // --- Covenants (Spot % Success)
    // Liquidity: 2 items (1 pass), Efficiency: 1 item (1 pass)
    const covenant_rows = [
      { Category: "Liquidity", Analysis: true },
      { Category: "Liquidity", Analysis: false },
      { Category: "Efficiency", Analysis: true },
      { Category: null, Analysis: true }, // should be ignored
    ];

    // --- Key Ratios (3 yr Avg % Success)
    // Use KeyRatioID groups; pass if latest.Value <= avg(Value)
    const ratio_rows = [
      // Liquidity group 1 (pass): avg = (10 + 9)/2 = 9.5; latest = 9 → pass
      { KeyRatioID: 1, Timeline: 2023, Value: 10, Category: "Liquidity" },
      { KeyRatioID: 1, Timeline: 2024, Value: 9, Category: "Liquidity" },

      // Liquidity group 2 (fail): avg = (8 + 12)/2 = 10; latest = 12 → fail
      { KeyRatioID: 2, Timeline: 2023, Value: 8, Category: "Liquidity" },
      { KeyRatioID: 2, Timeline: 2024, Value: 12, Category: "Liquidity" },

      // Efficiency group (pass): avg = 5; latest = 5 → pass
      { KeyRatioID: 3, Timeline: 2023, Value: 5, Category: "Efficiency" },
    ];

    filter_covenants.mockResolvedValue(covenant_rows);
    ratio_service.mockResolvedValue(ratio_rows);

    const result = await derive_success_rates({ applicationid });

    // Services called as expected
    expect(filter_covenants).toHaveBeenCalledWith({ applicationid });
    expect(ratio_service).toHaveBeenCalledWith({ applicationid });

    // Result should include both categories
    expect(Array.isArray(result)).toBe(true);
    const liquidity = result.find((r) => r.Category === "Liquidity");
    const efficiency = result.find((r) => r.Category === "Efficiency");

    expect(liquidity).toBeTruthy();
    expect(efficiency).toBeTruthy();

    // ApplicationID coerced to number
    expect(liquidity.ApplicationID).toBe(2);
    expect(efficiency.ApplicationID).toBe(2);

    // Spot % Success:
    // Liquidity: 1/2 = 50, Efficiency: 1/1 = 100
    expect(liquidity["Spot % Success"]).toBeCloseTo(50, 5);
    expect(efficiency["Spot % Success"]).toBeCloseTo(100, 5);

    // 3 yr Average % Success:
    // Liquidity: 1/2 = 50, Efficiency: 1/1 = 100
    expect(liquidity["3 yr Average % Success"]).toBeCloseTo(50, 5);
    expect(efficiency["3 yr Average % Success"]).toBeCloseTo(100, 5);
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
