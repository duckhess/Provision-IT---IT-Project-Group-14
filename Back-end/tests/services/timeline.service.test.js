import { jest } from "@jest/globals";

// Mock timeline schema
jest.unstable_mockModule("../../src/models/timelines.js", () => ({
  default: { find: jest.fn() },
}));

const timeline_schema = (await import("../../src/models/timelines.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");

// Helper to mock .find().lean()
const mockFindLean = (model, rows) => {
  const lean_function = jest.fn().mockResolvedValue(rows);
  model.find.mockReturnValue({ lean: lean_function });
  return { lean_function };
};

describe("timeline.service get_period", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------
  // Negative Test Cases
  // ------------------

  test("Negative: No fileIDs provided → returns empty map", async () => {
    const result = await get_period();
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  test("Negative: Invalid fileIDs input (not an array) → returns empty map", async () => {
    const result = await get_period("invalid");
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  test("Negative: fileIDs not found in DB → returns empty map", async () => {
    mockFindLean(timeline_schema, []);
    const result = await get_period([999]);
    expect(result.size).toBe(0);
  });

  // ------------------
  // Positive Test Cases
  // ------------------

  test("Positive: Single fileID → returns correct period map", async () => {
    const fileID = 101;
    const period = 202510;

    mockFindLean(timeline_schema, [{ FileID: fileID, period }]);

    const result = await get_period([fileID]);
    expect(timeline_schema.find).toHaveBeenCalledWith({ FileID: { $in: [fileID] } });
    expect(result.get(fileID)).toBe(period);
    expect(result.size).toBe(1);
  });

  test("Positive: Multiple fileIDs → returns map of fileID to period", async () => {
    const fileIDs = [101, 102];
    const rows = [
      { FileID: 101, period: 202510 },
      { FileID: 102, period: 202511 },
    ];

    mockFindLean(timeline_schema, rows);

    const result = await get_period(fileIDs);

    expect(timeline_schema.find).toHaveBeenCalledWith({ FileID: { $in: fileIDs } });
    expect(result.get(101)).toBe(202510);
    expect(result.get(102)).toBe(202511);
    expect(result.size).toBe(2);
  });
});
