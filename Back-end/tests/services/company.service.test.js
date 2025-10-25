// __tests__/company_service.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/company.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

// --- Imports after mocks ---
const company_model = (await import("../../src/models/company.model.js")).default;
const { list_companies_service } = await import("../../src/services/company.service.js");

// --- Helper ---
const mock_find_select_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  const select_fn = jest.fn().mockReturnValue({ lean: lean_fn });
  model.find.mockReturnValue({ select: select_fn });
  return { select_fn, lean_fn };
};

describe("list_companies_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: returns_mapped_list_of_companies", async () => {
    const mock_rows = [
      { CompanyID: 1001, CompanyName: "UrbanRide", IndustryID: 321 },
      { CompanyID: 1002, CompanyName: "EcoTech", IndustryID: 654 },
    ];

    const find_mock = mock_find_select_lean(company_model, mock_rows);

    const result = await list_companies_service();

    expect(company_model.find).toHaveBeenCalledWith();
    expect(find_mock.select_fn).toHaveBeenCalledWith("-_id -__v");
    expect(find_mock.lean_fn).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      { companyId: 1001, companyName: "UrbanRide", industryId: 321 },
      { companyId: 1002, companyName: "EcoTech", industryId: 654 },
    ]);
  });

  test("negative_case: no_documents_returns_empty_array", async () => {
    mock_find_select_lean(company_model, []);

    const result = await list_companies_service();

    expect(company_model.find).toHaveBeenCalledWith();
    expect(result).toEqual([]);
  });

  test("edge_case: ignores_extra_fields_and_maps_only_required_keys", async () => {
    const mock_rows = [
      {
        CompanyID: 77,
        CompanyName: "MinimalCo",
        IndustryID: 9,
        ExtraField: "ignored",
      },
    ];

    mock_find_select_lean(company_model, mock_rows);

    const result = await list_companies_service();

    expect(result).toEqual([
      { companyId: 77, companyName: "MinimalCo", industryId: 9 },
    ]);
  });
});
