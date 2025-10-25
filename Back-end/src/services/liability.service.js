import liability_model from "../models/liability.model.js";
import liability_value_model from "../models/liability_value.model.js";
import { get_period } from "./timeline.service.js";
import mongoose from "mongoose";

const to_js_number = (v) => {
  if (v == null) return v;
  if (
    typeof v === "object" &&
    (v._bsontype === "Decimal128" || v instanceof mongoose.Types.Decimal128)
  ) {
    return parseFloat(v.toString());
  }
  return v;
};

const results = (r) => ({
  LiabilityID: r.LiabilitiesID,
  MetricName: r.Metric,
  Unit: r.Unit,
  ApplicationID: r.ApplicationID,
  Timeline: r.Period,
  Value: to_js_number(r.Value),
});

export async function liability_service(filters = {}) {
  const matching_params = {};
  if (filters.liabilityid != null) matching_params.LiabilitiesID = Number(filters.liabilityid);
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid);

  const values = await liability_value_model.find(matching_params).select("-__v -_id").lean();
  if (values.length === 0) return [];

  const fetched_ids = [...new Set(values.map((v) => v.LiabilitiesID))];
  const key_query = { LiabilitiesID: { $in: fetched_ids } };

  if (filters.metric && String(filters.metric).trim() !== "") {
    const metric_regex = String(filters.metric)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key_query.Metric = { $regex: metric_regex, $options: "i" };
  }

  if (filters.unit && String(filters.unit).trim() !== "") {
    const unit_regex = String(filters.unit)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key_query.Unit = { $regex: unit_regex, $options: "i" };
  }

  const key_docs = await liability_model
    .find(key_query)
    .select("-_id LiabilitiesID Metric Unit ")
    .lean();
  if (key_docs.length === 0) return [];

  const by_id = new Map(key_docs.map((d) => [d.LiabilitiesID, d]));
  const filtered_values = values.filter((v) => by_id.has(v.LiabilitiesID));

  const file_ids = [...new Set(filtered_values.map((v) => v.FileID))];
  const timeline_map = await get_period(file_ids);

  return filtered_values.map((v) => {
    const meta = by_id.get(v.LiabilitiesID);
    return results({
      ...v,
      Metric: meta.Metric,
      Unit: meta.Unit,
      Period: timeline_map.get(v?.FileID),
    });
  });
}
