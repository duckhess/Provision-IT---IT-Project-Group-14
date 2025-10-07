import assetModel from "../models/asset.model.js";
import assetValueModel from "../models/asset_value.model.js";

const FILE_TIMELINE = {
    1: '2023',
    2: '2024',
    3: '2025',
};

function toTimeline(fileId) {
  return FILE_TIMELINE[fileId] || `File ${fileId}`;
}

const results = (r) => ({
  AssetsID: r.AssetsID,  
  AccountDesciption : r.AccountDesciption,
  Unit: r.Unit,
  ApplicationID : r.ApplicationID,
  FileID : r.FileID,
  Timeline: toTimeline(r.FileID),   
  Value : r.Value
})

export async function ratioService(filters = {}) {

  const matching_params = {}
  if (filters.assetid != null) matching_params.KeyRatioID = Number(filters.assetid)
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid)
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid)
  
  const values = await assetValueModel.find(matching_params).select("-__v -_id").lean()
  if (values.length === 0) return []

  // find assetsid in asset table
  const fetchedIDs = [...new Set(values.map(v =>AssetsID))]
  const keyQuery = {AssetsID: { $in: fetchedIDs } };

  // filter account description 
  if (filters.accountdescription && String(filters.accountdescription).trim() !== "") {
  const descriptionRegex = String(filters.accountdescription).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  keyQuery.Metric = { $regex: descriptionRegex, $options: "i" };
  }

  //filter unit
  if (filters.unit && String(filters.unit).trim() !== "") {
    const unitRegex = String(filters.unit).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    keyQuery.Unit = { $regex: unitRegex, $options: "i" }
  }

  // find metric name and unit in key ratio table 
  const keyDocs = await assetModel.find(keyQuery).select("-_id AssetsID AccountDescription Unit ").lean();
  if (keyDocs.length === 0) return []

  const byId = new Map(keyDocs.map(d => [d.AssetsID, d]))

  const filteredValues = values.filter(v => byId.has(v.AssetsID))

  return filteredValues.map(v => {
    const meta = byId.get(v.AssetsID);
    return results({
      ...v,                 
      AccountDesciption: meta.AccountDesciption,  
      Unit: meta.Unit, 
    });
  });
}






