import { jest } from "@jest/globals";

// Mocks
jest.unstable_mockModule("../../src/models/best_four_metrics.model.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../../src/services/financial_statements.service.js", () => ({
  filter_statements: jest.fn(),
}));

// Imports after mocks
const best4_model = (await import("../../src/models/best_four_metrics.model.js")).default;
const { filter_statements } = await import("../../src/services/financial_statements.service.js");
const { best_four_metrics_service } = await import(
  "../../src/services/best_four_metrics.service.js"
);

describe("best_four_metrics_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("✅ positive_case: numeric query, maps data with non-empty statements", async () => {
    const filters = {
      companyid: "1001",
      applicationid: "2",
      metricid: "5",
    };

    const mock_defs = [
      {
        CompanyID: 1001,
        ApplicationID: 2,
        MetricID: 5,
        Metric: "Return on Assets",
      },
    ];

    const mock_rows = [
      { Metric: "Return on Assets", Unit: "%", Timeline: "2023", Value: 0.15 },
      { Metric: "Return on Assets", Unit: "%", Timeline: "2024", Value: 0.17 },
    ];

    best4_model.find.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(mock_defs) }),
    });

    filter_statements.mockResolvedValue(mock_rows);

    const result = await best_four_metrics_service(filters);

    expect(best4_model.find).toHaveBeenCalledWith({
      CompanyID: 1001,
      ApplicationID: 2,
      MetricID: 5,
    });
    expect(filter_statements).toHaveBeenCalledWith({
      financialid: 5,
      applicationid: "2", // use provided filter if present
    });

    expect(result).toEqual([
      {
        CompanyID: 1001,
        ApplicationID: 2,
        Table: "financial_statements",
        MetricID: 5,
        MetricName: "Return on Assets",
        Unit: "%",
        Data: [
          { Timeline: "2023", Value: 0.15 },
          { Timeline: "2024", Value: 0.17 },
        ],
      },
    ]);
  });

  test("❌ negative_case: no definitions → returns []", async () => {
    best4_model.find.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve([]) }),
    });

    const result = await best_four_metrics_service({ companyid: "1001" });

    expect(best4_model.find).toHaveBeenCalledWith({ CompanyID: 1001 });
    expect(result).toEqual([]);
    expect(filter_statements).not.toHaveBeenCalled();
  });

  test("🧩 edge_case: definitions found but filter_statements returns [] → Unit null", async () => {
    const mock_defs = [
      {
        CompanyID: 2002,
        ApplicationID: 3,
        MetricID: 8,
        Metric: "Debt Ratio",
      },
    ];

    best4_model.find.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(mock_defs) }),
    });

    filter_statements.mockResolvedValue([]);

    const result = await best_four_metrics_service({
      companyid: "2002",
      applicationid: "3",
    });

    expect(filter_statements).toHaveBeenCalledWith({
      financialid: 8,
      applicationid: "3",
    });

    expect(result).toEqual([
      {
        CompanyID: 2002,
        ApplicationID: 3,
        Table: "financial_statements",
        MetricID: 8,
        MetricName: "Debt Ratio",
        Unit: null,
        Data: [],
      },
    ]);
  });

  test("🧠 fallback_case: uses def.ApplicationID when filter missing", async () => {
    const mock_defs = [
      {
        CompanyID: 3003,
        ApplicationID: 7,
        MetricID: 9,
        Metric: "Profit Margin",
      },
    ];

    const mock_rows = [{ Metric: "Profit Margin", Unit: "%", Timeline: "2024", Value: 0.22 }];

    best4_model.find.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(mock_defs) }),
    });

    filter_statements.mockResolvedValue(mock_rows);

    const result = await best_four_metrics_service({ companyid: "3003" });

    expect(filter_statements).toHaveBeenCalledWith({
      financialid: 9,
      applicationid: 7, // fallback to definition's ApplicationID
    });

    expect(result[0]).toEqual(
      expect.objectContaining({
        MetricName: "Profit Margin",
        Unit: "%",
        Data: [{ Timeline: "2024", Value: 0.22 }],
      }),
    );
  });
});
