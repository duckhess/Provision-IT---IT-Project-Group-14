import { jest } from "@jest/globals";

// Mock the Industry model
jest.unstable_mockModule("../../src/models/industry.model.js", () => ({
  default: { findOne: jest.fn(), find: jest.fn() },
}));

const industry_schema = (await import("../../src/models/industry.model.js")).default;
const { get_industry_by_id_service, list_industries_service } = await import(
  "../../src/services/industry.service.js"
);

// Helper to mock .find().lean()
const mock_find_lean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  const select_function = jest.fn().mockReturnValue({ lean: lean_function });
  model.find.mockReturnValue({ select: select_function });
  return { select_function, lean_function };
};

// Helper to mock .findOne().lean()
const mock_find_one_lean = (model, row) => {
  const lean_function = jest.fn().mockResolvedValue(row);
  model.findOne.mockReturnValue({ lean: lean_function });
  return { lean_function };
};

describe("Industry Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Positive Test Case: get industry by ID returns formatted object", async () => {
    const mock_industry = { IndustryID: 1, IndustryName: "Technology" };
    mock_find_one_lean(industry_schema, mock_industry);

    const result = await get_industry_by_id_service(1);

    expect(industry_schema.findOne).toHaveBeenCalledWith({ IndustryID: 1 });
    expect(result).toEqual({ IndustryId: 1, IndustryName: "Technology" });
  });

  test("Negative Test Case: get industry by ID returns null if not found", async () => {
    mock_find_one_lean(industry_schema, null);

    const result = await get_industry_by_id_service(999);

    expect(industry_schema.findOne).toHaveBeenCalledWith({ IndustryID: 999 });
    expect(result).toBeNull();
  });

  test("Positive Test Case: list_industries_service returns list of formatted industries", async () => {
    const mock_industries = [
      { IndustryID: 1, IndustryName: "Technology" },
      { IndustryID: 2, IndustryName: "Healthcare" },
    ];
    mock_find_lean(industry_schema, mock_industries);

    const result = await list_industries_service();

    expect(industry_schema.find).toHaveBeenCalled();
    expect(result).toEqual([
      { IndustryId: 1, IndustryName: "Technology" },
      { IndustryId: 2, IndustryName: "Healthcare" },
    ]);
  });
});
