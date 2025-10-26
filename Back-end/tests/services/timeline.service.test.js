import { jest } from "@jest/globals";

// Mock timeline schema
jest.unstable_mockModule("../../src/models/timelines.js", () => ({
  default: { find: jest.fn() },
}));

const timeline_schema = (await import("../../src/models/timelines.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");

// Helper to mock .find().lean()
const mock_find_lean = (model, rows) => {
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
    mock_find_lean(timeline_schema, []);
    const result = await get_period([999]);
    expect(result.size).toBe(0);
  });

  // ------------------
  // Positive Test Cases
  // ------------------

  test("Positive: Single file_id → returns correct period map", async () => {
    const file_id = 101;
    const period = 202510;

    mock_find_lean(timeline_schema, [{ FileID: file_id, period }]);

    const result = await get_period([file_id]);
    expect(timeline_schema.find).toHaveBeenCalledWith({ FileID: { $in: [file_id] } });
    expect(result.get(file_id)).toBe(period);
    expect(result.size).toBe(1);
  });

  test("Positive: Multiple file_ids → returns map of file_id to period", async () => {
    const file_ids = [101, 102];
    const rows = [
      { FileID: 101, period: 202510 },
      { FileID: 102, period: 202511 },
    ];

    mock_find_lean(timeline_schema, rows);

    const result = await get_period(file_ids);

    expect(timeline_schema.find).toHaveBeenCalledWith({ FileID: { $in: file_ids } });
    expect(result.get(101)).toBe(202510);
    expect(result.get(102)).toBe(202511);
    expect(result.size).toBe(2);
  });
});
