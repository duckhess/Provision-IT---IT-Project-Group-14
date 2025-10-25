// __tests__/asset_service.test.js
import { jest } from "@jest/globals";

// --- Mocks ---
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

jest.unstable_mockModule("../../src/services/timeline_service.js", () => ({
  get_period: jest.fn(),
}));

// --- Imports after mocks ---
const asset_value_model = (await import("../../src/models/asset_value.model.js")).default;
const asset_model = (await import("../../src/models/asset.model.js")).default;
const { get_period } = await import("../../src/services/timeline_service.js");
const { assetService: asset_service } = await import("../../src/services/asset.service.js");

// --- Helpers ---
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

  test(
    "positive_case: converts_numeric_filters_applies_accountdescription_unit_regex_joins_meta_maps_timeline_value",
    async () => {
      const filters = {
        assetsid: "1",
        applicationid: "2",
        fileid: "3",
        accountdescription: "cash",
        unit: "$",
      };

      const values_rows = [
        {
          AssetsID: 1,
          ApplicationID: 2,
          FileID: 3,
          Period: undefined,
          Value: 42.5,
        },
      ];

      const key_docs = [
        {
          AssetsID: 1,
          AccountDescription: "Cash and cash equivalents",
          Unit: "$",
        },
      ];

      const values_find = mock_find_select_lean(asset_value_model, values_rows);
      const keys_find = mock_find_select_lean(asset_model, key_docs);

      get_period.mockResolvedValue(new Map([[3, "2024"]]));

      const result = await asset_service(filters);

      expect(asset_value_model.find).toHaveBeenCalledTimes(1);
      expect(asset_value_model.find).toHaveBeenCalledWith({
        AssetsID: 1,
        ApplicationID: 2,
        FileID: 3,
      });
      expect(values_find.select_fn).toHaveBeenCalledWith("-__v -_id");
      expect(values_find.lean_fn).toHaveBeenCalledTimes(1);

      expect(asset_model.find).toHaveBeenCalledTimes(1);
      const key_arg = asset_model.find.mock.calls[0][0];
      expect(key_arg).toEqual(
        expect.objectContaining({
          AssetsID: { $in: [1] },
          AccountDescription: {
            $regex: "cash",
            $options: "i",
          },
          Unit: {
            $regex: "\\$",
            $options: "i",
          },
        }),
      );
      expect(keys_find.select_fn).toHaveBeenCalledWith("-_id AssetsID AccountDescription Unit ");
      expect(keys_find.lean_fn).toHaveBeenCalledTimes(1);

      // timeline mapping called with unique FileIDs
      expect(get_period).toHaveBeenCalledWith([3]);

      // final mapped result
      expect(result).toEqual([
        {
          AssetsID: 1,
          MetricName: "Cash and cash equivalents",
          Unit: "$",
          ApplicationID: 2,
          Timeline: "2024",
          Value: 42.5,
        },
      ]);
    }
  );

  test("negative_case: no_values_found_returns_empty_and_does_not_query_asset_model", async () => {
    // no values
    mock_find_select_lean(asset_value_model, []);
    // still mock-safe
    const keys_find = mock_find_select_lean(asset_model, []);

    get_period.mockResolvedValue(new Map());

    const result = await asset_service({ assetsid: "7" });

    expect(asset_value_model.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);

    // ensure no meta fetch when values empty
    expect(asset_model.find).toHaveBeenCalledTimes(0);
    expect(get_period).toHaveBeenCalledTimes(0);

    void keys_find; // avoid unused var
  });

  test("negative_case: values_found_but_no_matching_meta_rows_returns_empty", async () => {
    const values_rows = [{ AssetsID: 9, ApplicationID: 2, FileID: 5, Value: 100.0 }];
    mock_find_select_lean(asset_value_model, values_rows);

    // no meta rows
    mock_find_select_lean(asset_model, []);

    get_period.mockResolvedValue(new Map([[5, "2025"]]));

    const result = await asset_service({ assetsid: "9", applicationid: "2" });

    expect(asset_value_model.find).toHaveBeenCalledWith({
      AssetsID: 9,
      ApplicationID: 2,
    });
    expect(asset_model.find).toHaveBeenCalledWith({
      AssetsID: { $in: [9] },
    });
    expect(result).toEqual([]);
  });

  test(
    "query_building_case: when_accountdescription_unit_filters_absent_do_not_include_them_in_key_query",
    async () => {
      const values_rows = [{ AssetsID: 11, ApplicationID: 1, FileID: 2, Value: 7 }];
      mock_find_select_lean(asset_value_model, values_rows);

      const key_docs = [{ AssetsID: 11, AccountDescription: "Receivables", Unit: "AUD" }];
      mock_find_select_lean(asset_model, key_docs);

      get_period.mockResolvedValue(new Map([[2, "2023"]]));

      const result = await asset_service({
        assetsid: "11",
        applicationid: "1",
        fileid: "2",
      });

      const key_arg = asset_model.find.mock.calls[0][0];
      expect(key_arg).toEqual(
        expect.objectContaining({
          AssetsID: { $in: [11] },
        }),
      );
      expect(key_arg).not.toHaveProperty("AccountDescription");
      expect(key_arg).not.toHaveProperty("Unit");

      expect(result).toEqual([
        {
          AssetsID: 11,
          MetricName: "Receivables",
          Unit: "AUD",
          ApplicationID: 1,
          Timeline: "2023",
          Value: 7,
        },
      ]);
    }
  );
});
