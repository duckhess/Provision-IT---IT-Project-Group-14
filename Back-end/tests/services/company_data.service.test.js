import { jest } from "@jest/globals";

// --- Mocks ---
jest.unstable_mockModule("../../src/models/company_data.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

// --- Imports after mocks ---
const company_data_model = (await import("../../src/models/company_data.model.js")).default;
const { company_data_service } = await import("../../src/services/company_data.service.js");

// --- Helper ---
const mock_find_select_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  const select_fn = jest.fn().mockReturnValue({ lean: lean_fn });
  model.find.mockReturnValue({ select: select_fn });
  return { select_fn, lean_fn };
};

describe("company_data_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive_case: filters_by_companyid_and_applicationid_and_maps_fields_correctly", async () => {
    const filters = {
      companyid: "1001",
      applicationid: "5",
    };

    const mock_rows = [
      {
        CompanyID: 1001,
        CompanyName: "UrbanRide",
        Industry: "Transportation",
        IndustryID: 321,
        ApplicationID: 5,
        YearEstablished: 2019,
        Location: "Melbourne",
        UsageOfFunds: "Fleet Expansion",
        Amount: 500000,
        EnvironmentalScore: 80,
        SocialScore: 75,
        GovernanceScore: 90,
        ShortGeneralDescription: "Ride-sharing startup",
        LongGeneralDescription:
          "UrbanRide provides eco-friendly ride-sharing and fleet management services.",
        ShortApplicationDescription: "Seeking funding for EV fleet",
        LongApplicationDescription:
          "Funds will be used to purchase electric vehicles and expand charging infrastructure.",
      },
    ];

    const find_mock = mock_find_select_lean(company_data_model, mock_rows);

    const result = await company_data_service(filters);

    expect(company_data_model.find).toHaveBeenCalledWith({
      CompanyID: 1001,
      ApplicationID: 5,
    });
    expect(find_mock.select_fn).toHaveBeenCalledWith("-__v -_id");
    expect(find_mock.lean_fn).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        CompanyID: 1001,
        CompanyName: "UrbanRide",
        Industry: "Transportation",
        IndustryID: 321,
        ApplicationID: 5,
        YearEstablished: 2019,
        Location: "Melbourne",
        UsageOfFunds: "Fleet Expansion",
        Amount: 500000,
        EnvironmentalScore: 80,
        SocialScore: 75,
        GovernanceScore: 90,
        ShortGeneralDescription: "Ride-sharing startup",
        LongGeneralDescription:
          "UrbanRide provides eco-friendly ride-sharing and fleet management services.",
        ShortApplicationDescription: "Seeking funding for EV fleet",
        LongApplicationDescription:
          "Funds will be used to purchase electric vehicles and expand charging infrastructure.",
      },
    ]);
  });

  test("negative_case: no_matching_documents_returns_empty_array", async () => {
    mock_find_select_lean(company_data_model, []);

    const result = await company_data_service({ companyid: "9999" });

    expect(company_data_model.find).toHaveBeenCalledWith({
      CompanyID: 9999,
    });
    expect(result).toEqual([]);
  });

  test("edge_case: only_applicationid_provided_filters_correctly", async () => {
    const mock_rows = [{ CompanyID: 2020, CompanyName: "EcoTech", ApplicationID: 7 }];

    const find_mock = mock_find_select_lean(company_data_model, mock_rows);

    const result = await company_data_service({ applicationid: "7" });

    expect(company_data_model.find).toHaveBeenCalledWith({
      ApplicationID: 7,
    });
    expect(find_mock.select_fn).toHaveBeenCalledWith("-__v -_id");
    expect(result).toEqual([
      {
        CompanyID: 2020,
        CompanyName: "EcoTech",
        Industry: undefined,
        IndustryID: undefined,
        ApplicationID: 7,
        YearEstablished: undefined,
        Location: undefined,
        UsageOfFunds: undefined,
        Amount: undefined,
        EnvironmentalScore: undefined,
        SocialScore: undefined,
        GovernanceScore: undefined,
        ShortGeneralDescription: undefined,
        LongGeneralDescription: undefined,
        ShortApplicationDescription: undefined,
        LongApplicationDescription: undefined,
      },
    ]);
  });
});
