import key_ratio_model from "../models/key_ratio.model.js";
import key_ratio_value_model from "../models/key_ratios_values.model.js";
import { get_period } from "./timeline.service.js";

const results = (r) => ({
  KeyRatioID: r.KeyRatioID,
  MetricName: r.Metric,
  Unit: r.Unit,
  Category: r.Category,
  ApplicationID: r.ApplicationID,
  Timeline: r.Period,
  Value: r.Value,
});

export async function ratio_service(filters = {}) {
  const matching_params = {};
  if (filters.keyratioid != null) matching_params.KeyRatioID = Number(filters.keyratioid);
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid);

  const values = await key_ratio_value_model.find(matching_params).select("-__v -_id").lean();
  if (values.length === 0) return [];

  // find keyratioid in key ratio table
  const fetched_ids = [...new Set(values.map((v) => v.KeyRatioID))];
  const key_query = { KeyRatioID: { $in: fetched_ids } };

  // filter metric name
  if (filters.metric && String(filters.metric).trim() !== "") {
    const metric_regex = String(filters.metric)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key_query.Metric = { $regex: metric_regex, $options: "i" };
  }

  // filter unit
  if (filters.unit && String(filters.unit).trim() !== "") {
    const unit_regex = String(filters.unit)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key_query.Unit = { $regex: unit_regex, $options: "i" };
  }

  // find metric name and unit in key ratio table
  const key_docs = await key_ratio_model
    .find(key_query)
    .select("-_id KeyRatioID Metric Unit Category ")
    .lean();
  if (key_docs.length === 0) return [];

  const by_id = new Map(key_docs.map((d) => [d.KeyRatioID, d]));
  const filtered_values = values.filter((v) => by_id.has(v.KeyRatioID));

  const file_ids = [...new Set(filtered_values.map((v) => v.FileID))];
  const timeline_map = await get_period(file_ids);

  return filtered_values.map((v) => {
    const meta = by_id.get(v.KeyRatioID);
    return results({
      ...v,
      Metric: meta.Metric,
      Unit: meta.Unit,
      Category: meta.Category,
      Period: timeline_map.get(v?.FileID),
    });
  });
}
