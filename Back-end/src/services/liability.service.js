import liabilityModel from "../models/liability.model.js";
import liabilityValueModel from "../models/liability_value.model.js";
import { get_period } from "./timeline_service.js";

const toJsNumber = (v) => {
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
  Value: toJsNumber(r.Value),
});

export async function liabilityService(filters = {}) {
  const matching_params = {};
  if (filters.liabilityid != null) matching_params.LiabilitiesID = Number(filters.liabilityid);
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid);

  const values = await liabilityValueModel.find(matching_params).select("-__v -_id").lean();
  if (values.length === 0) return [];

  // find id in table
  const fetchedIDs = [...new Set(values.map((v) => v.LiabilitiesID))];
  const keyQuery = { LiabilitiesID: { $in: fetchedIDs } };

  // filter metric name
  if (filters.metric && String(filters.metric).trim() !== "") {
    const metricRegex = String(filters.metric)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    keyQuery.Metric = { $regex: metricRegex, $options: "i" };
  }

  //filter unit
  if (filters.unit && String(filters.unit).trim() !== "") {
    const unitRegex = String(filters.unit)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    keyQuery.Unit = { $regex: unitRegex, $options: "i" };
  }

  // find metric name and unit in liabilty table
  const keyDocs = await liabilityModel
    .find(keyQuery)
    .select("-_id LiabilitiesID Metric Unit ")
    .lean();
  if (keyDocs.length === 0) return [];

  const byId = new Map(keyDocs.map((d) => [d.LiabilitiesID, d]));

  const filteredValues = values.filter((v) => byId.has(v.LiabilitiesID));

  const fileIDs = [...new Set(filteredValues.map((v) => v.FileID))];
  const timelineMap = await get_period(fileIDs);

  return filteredValues.map((v) => {
    const meta = byId.get(v.LiabilitiesID);
    return results({
      ...v,
      Metric: meta.Metric,
      Unit: meta.Unit,
      Period: timelineMap.get(v?.FileID),
    });
  });
}
