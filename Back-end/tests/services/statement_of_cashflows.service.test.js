// __tests__/statement_of_cashflows_service.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/statement_of_cashflows_values.models.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/statement_of_cashflows.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

// --- Imports after mocks ---
const cashflow_values_schema = (
  await import("../../src/models/statement_of_cashflows_values.models.js")
).default;
const cashflow_schema = (await import("../../src/models/statement_of_cashflows.model.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { soc_service } = await import("../../src/services/statement_of_cashflows.service.js");

// --- Helpers ---
const mock_find_select_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  const select_fn = jest.fn().mockReturnValue({ lean: lean_fn });
  model.find.mockReturnValue({ select: select_fn });
  return { select_fn, lean_fn };
};

describe("statement_of_cashflows.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: returns mapped cashflow values with timeline", async () => {
    const filters = {
      cashflowid: "1",
      applicationid: "2",
      fileid: "3",
      metric: "Revenue",
      unit: "USD",
    };

    const values_rows = [{ CashflowID: 1, ApplicationID: 2, FileID: 3, Value: 100.5 }];

    const key_docs = [{ CashflowID: 1, Metric: "Revenue", Unit: "USD" }];

    mock_find_select_lean(cashflow_values_schema, values_rows);
    mock_find_select_lean(cashflow_schema, key_docs);

    get_period.mockResolvedValue(new Map([[3, "2025-Q1"]]));

    const result = await soc_service(filters);

    expect(cashflow_values_schema.find).toHaveBeenCalledWith({
      CashflowID: 1,
      ApplicationID: 2,
      FileID: 3,
    });

    expect(cashflow_schema.find).toHaveBeenCalledWith({
      CashflowID: { $in: [1] },
      Metric: { $regex: "Revenue", $options: "i" },
      Unit: { $regex: "USD", $options: "i" },
    });

    expect(get_period).toHaveBeenCalledWith([3]);

    expect(result).toEqual([
      {
        CashflowID: 1,
        MetricName: "Revenue",
        Unit: "USD",
        ApplicationID: 2,
        Timeline: "2025-Q1",
        Value: 100.5,
      },
    ]);
  });

  test("negative_case: no values found returns empty array", async () => {
    mock_find_select_lean(cashflow_values_schema, []);
    const keys_find = mock_find_select_lean(cashflow_schema, []);

    get_period.mockResolvedValue(new Map());

    const result = await soc_service({ cashflowid: "999" });

    expect(cashflow_values_schema.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);

    // ensure no meta fetch when values empty
    expect(cashflow_schema.find).toHaveBeenCalledTimes(0);
    expect(get_period).toHaveBeenCalledTimes(0);

    void keys_find; // avoid unused var warning
  });

  test("negative_case: values found but no matching meta returns empty array", async () => {
    const values_rows = [{ CashflowID: 5, ApplicationID: 2, FileID: 3, Value: 55 }];
    mock_find_select_lean(cashflow_values_schema, values_rows);
    mock_find_select_lean(cashflow_schema, []);

    get_period.mockResolvedValue(new Map([[3, "2025-Q1"]]));

    const result = await soc_service({ cashflowid: "5", applicationid: "2" });

    expect(cashflow_values_schema.find).toHaveBeenCalledWith({
      CashflowID: 5,
      ApplicationID: 2,
    });
    expect(cashflow_schema.find).toHaveBeenCalledWith({ CashflowID: { $in: [5] } });
    expect(result).toEqual([]);
  });
});
