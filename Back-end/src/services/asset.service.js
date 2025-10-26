import assetModel from "../models/asset.model.js"
import assetValueModel from "../models/asset_value.model.js"
import { get_period } from './timeline_service.js'

const toJsNumber = (v) => {
  if (v == null) return v
  if (typeof v === "object" && (v._bsontype === "Decimal128" || v instanceof mongoose.Types.Decimal128)) {
    return parseFloat(v.toString()) 
  }
  return v
}

const results = (r) => ({
  AssetsID: r.AssetsID,  
  MetricName : r.MetricName,
  Unit: r.Unit,
  ApplicationID : r.ApplicationID,
  Timeline: r.Period, 
  Value : toJsNumber(r.Value)
})

export async function assetService(filters = {}) {
  const matching_params = {}
  if (filters.assetsid != null) matching_params.AssetsID = Number(filters.assetsid)
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid)
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid)

  const values = await assetValueModel.find(matching_params).select("-__v -_id").lean()
  if (values.length === 0) return []

  // find assetsid in asset table
  const fetchedIDs = [...new Set(values.map(v =>v.AssetsID))]
  const keyQuery = {AssetsID: { $in: fetchedIDs } }

  // account description filter (correct field name)
  if (filters.accountdescription && String(filters.accountdescription).trim() !== "") {
  const descriptionRegex = String(filters.accountdescription).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  keyQuery.AccountDescription = { $regex: descriptionRegex, $options: "i" }
  keyQuery.AccountDescription = { $regex: descriptionRegex, $options: "i" }
  }

  // unit filter
  if (filters.unit && String(filters.unit).trim() !== "") {
    const unitRegex = String(filters.unit).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    keyQuery.Unit = { $regex: unitRegex, $options: "i" };
  }

  
  const keyDocs = await assetModel.find(keyQuery).select("-_id AssetsID AccountDescription Unit ").lean()
  if (keyDocs.length === 0) return []

  const byId = new Map(keyDocs.map((d) => [d.AssetsID, d]))
  const filteredValues = values.filter((v) => byId.has(v.AssetsID))

  const fileIDs = [...new Set(filteredValues.map(v => v.FileID))]
  const timelineMap = await get_period(fileIDs)

  return filteredValues.map(v => {
    const meta = byId.get(v.AssetsID)
    return results({
      ...v,                 
      MetricName: meta.AccountDescription,  
      Unit: meta.Unit,
      Period: timelineMap.get(v?.FileID),
    })
  })
}




