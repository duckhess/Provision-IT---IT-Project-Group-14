import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/models/asset_value.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/models/asset.model.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/services/timeline.service.js", () => ({
  get_period: jest.fn(),
}));

const asset_value_model = (await import("../../src/models/asset_value.model.js")).default;
const asset_model = (await import("../../src/models/asset.model.js")).default;
const { get_period } = await import("../../src/services/timeline.service.js");
const { asset_service } = await import("../../src/services/asset.service.js");

const mock_find_select_lean = (model, rows) => {
  const lean_fn = jest.fn().mockResolvedValue(rows);
  const select_fn = jest.fn().mockReturnValue({ lean: lean_fn });
  model.find.mockReturnValue({ select: select_fn });
  return { select_fn, lean_fn };
};

describe("asset_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: returns formatted results with matched assets", async () => {
    const mock_value_docs = [
      { AssetsID: 1, FileID: 10, Value: 123.45 },
      { AssetsID: 2, FileID: 11, Value: 678.9 },
    ];

    const mock_key_docs = [
      { AssetsID: 1, AccountDescription: "Cash", Unit: "$" },
      { AssetsID: 2, AccountDescription: "Inventory", Unit: "$" },
    ];

    const mock_timeline = new Map([
      [10, "2023"],
      [11, "2024"],
    ]);

    mock_find_select_lean(asset_value_model, mock_value_docs);
    mock_find_select_lean(asset_model, mock_key_docs);
    get_period.mockResolvedValue(mock_timeline);

    const result = await asset_service({ application_id: "1" });

    expect(asset_value_model.find).toHaveBeenCalledWith({ ApplicationID: 1 });
    expect(asset_model.find).toHaveBeenCalled();
    expect(get_period).toHaveBeenCalledWith([10, 11]);
    expect(result).toEqual([
      {
        AssetsID: 1,
        MetricName: "Cash",
        Unit: "$",
        ApplicationID: undefined,
        Timeline: "2023",
        Value: 123.45,
      },
      {
        AssetsID: 2,
        MetricName: "Inventory",
        Unit: "$",
        ApplicationID: undefined,
        Timeline: "2024",
        Value: 678.9,
      },
    ]);
  });

  test("negative: returns empty array when no values found", async () => {
    mock_find_select_lean(asset_value_model, []);
    const result = await asset_service({});
    expect(result).toEqual([]);
  });

  test("negative: returns empty array when asset records missing", async () => {
    const mock_value_docs = [{ AssetsID: 1, FileID: 10, Value: 123.45 }];
    mock_find_select_lean(asset_value_model, mock_value_docs);
    mock_find_select_lean(asset_model, []);
    const result = await asset_service({});
    expect(result).toEqual([]);
  });
});
