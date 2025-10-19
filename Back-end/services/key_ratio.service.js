import keyRatioModel from "../models/key_ratio.model.js";
import keyRatioValueModel from "../models/key_ratios_values.model.js";
import { get_period } from './timeline_service.js'

const results = (r) => ({
  KeyRatioID: r.KeyRatioID,  
  MetricName: r.Metric,
  Unit: r.Unit,
  Category: r.Category,
  ApplicationID : r.ApplicationID,
  Period: r.Period,   
  Value : r.Value
})

export async function ratioService(filters = {}) {

  const matching_params = {}
  if (filters.keyratioid != null) matching_params.KeyRatioID = Number(filters.keyratioid)
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid)
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid)
  
  const values = await keyRatioValueModel.find(matching_params).select("-__v -_id").lean()
  if (values.length === 0) return []

  // find keyratioid in keyratio table
  const fetchedIDs = [...new Set(values.map(v => v.KeyRatioID))]
  const keyQuery = { KeyRatioID: { $in: fetchedIDs } };

  // filter metric name 
  if (filters.metric && String(filters.metric).trim() !== "") {
  const metricRegex = String(filters.metric).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  keyQuery.Metric = { $regex: metricRegex, $options: "i" };
  }

  //filter unit
  if (filters.unit && String(filters.unit).trim() !== "") {
    const unitRegex = String(filters.unit).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    keyQuery.Unit = { $regex: unitRegex, $options: "i" }
  }

  // find metric name and unit in key ratio table 
  const keyDocs = await keyRatioModel.find(keyQuery).select("-_id KeyRatioID Metric Unit Category ").lean();
  if (keyDocs.length === 0) return []

  const byId = new Map(keyDocs.map(d => [d.KeyRatioID, d]))

  const filteredValues = values.filter(v => byId.has(v.KeyRatioID))

  const fileIDs = [...new Set(filteredValues.map(v => v.FileID))]
  const timelineMap = await get_period(fileIDs)

  return filteredValues.map(v => {
    const meta = byId.get(v.KeyRatioID);
    return results({
      ...v,                 
      Metric: meta.Metric,  
      Unit: meta.Unit,
      Category: meta.Category,
      Period: timelineMap.get(v?.FileID),
    });
  });
}