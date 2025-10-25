import asset_model from "../models/asset.model.js";
import asset_value_model from "../models/asset_value.model.js";
import { get_period } from "./timeline.service.js";
import mongoose from "mongoose";

const to_js_number = (value) => {
  if (value == null) return value;
  if (
    typeof value === "object" &&
    (value._bsontype === "Decimal128" || value instanceof mongoose.Types.Decimal128)
  ) {
    return parseFloat(value.toString());
  }
  return value;
};

const format_results = (record) => ({
  AssetsID: record.AssetsID,
  MetricName: record.MetricName,
  Unit: record.Unit,
  ApplicationID: record.ApplicationID,
  Timeline: record.Period,
  Value: to_js_number(record.Value),
});

export async function asset_service(filters = {}) {
  const matching_params = {};
  if (filters.assetsid != null) matching_params.AssetsID = Number(filters.assetsid);
  if (filters.applicationid != null)
    matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid);

  const value_docs = await asset_value_model.find(matching_params).select("-__v -_id").lean();
  if (value_docs.length === 0) return [];

  const fetched_ids = [...new Set(value_docs.map((v) => v.AssetsID))];
  const key_query = { AssetsID: { $in: fetched_ids } };

  if (filters.accountdescription && String(filters.accountdescription).trim() !== "") {
    const description_regex = String(filters.accountdescription)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key_query.AccountDescription = { $regex: description_regex, $options: "i" };
  }

  if (filters.unit && String(filters.unit).trim() !== "") {
    const unit_regex = String(filters.unit)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key_query.Unit = { $regex: unit_regex, $options: "i" };
  }

  const key_docs = await asset_model
    .find(key_query)
    .select("-_id AssetsID AccountDescription Unit")
    .lean();
  if (key_docs.length === 0) return [];

  const by_id = new Map(key_docs.map((doc) => [doc.AssetsID, doc]));
  const filtered_values = value_docs.filter((v) => by_id.has(v.AssetsID));

  const file_ids = [...new Set(filtered_values.map((v) => v.FileID))];
  const timeline_map = await get_period(file_ids);

  return filtered_values.map((v) => {
    const meta = by_id.get(v.AssetsID);
    return format_results({
      ...v,
      MetricName: meta.AccountDescription,
      Unit: meta.Unit,
      Period: timeline_map.get(v?.FileID),
    });
  });
}
