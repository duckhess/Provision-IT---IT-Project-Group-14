import socModel from "../models/statement_of_cashflows.model.js";
import socValueModel from "../models/statement_of_cashflows_values.models.js";
import { get_period } from './timeline_service.js'

const toJsNumber = (v) => {
  if (v == null) return v;
  if (typeof v === "object" && (v._bsontype === "Decimal128" || v instanceof mongoose.Types.Decimal128)) {
    return parseFloat(v.toString()); 
  }
  return v;
};

const results = (r) => ({
  CashflowID: r.CashflowID,  
  Metric: r.Metric,
  Unit: r.Unit,
  ApplicationID : r.ApplicationID,
  Period: r.Period,   
  Value : toJsNumber(r.Value)
})

export async function socService(filters = {}) {

  const matching_params = {}
  if (filters.cashflowid != null) matching_params.CashflowID = Number(filters.cashflowid)
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid)
  if (filters.fileid != null) matching_params.FileID = Number(filters.fileid)
  
  const values = await socValueModel.find(matching_params).select("-__v -_id").lean()
  if (values.length === 0) return []

  // find cashflowid in soc table
  const fetchedIDs = [...new Set(values.map(v =>v.CashflowID))]
  const keyQuery = {CashflowID: { $in: fetchedIDs } };

  // filter metric
  if (filters.metric && String(filters.metric).trim() !== "") {
  const metricRegex = String(filters.metric).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  keyQuery.Metric = { $regex: metricRegex, $options: "i" };
  }

  //filter unit
  if (filters.unit && String(filters.unit).trim() !== "") {
    const unitRegex = String(filters.unit).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    keyQuery.Unit = { $regex: unitRegex, $options: "i" }
  }

  
  const keyDocs = await socModel.find(keyQuery).select("-_id CashflowID Metric Unit ").lean();
  if (keyDocs.length === 0) return []

  //join by id
  const byId = new Map(keyDocs.map(d => [d.CashflowID, d]))

  const filteredValues = values.filter(v => byId.has(v.CashflowID))

  const fileIDs = [...new Set(filteredValues.map(v => v.FileID))]
  const timelineMap = await get_period(fileIDs)

  return filteredValues.map(v => {
    const meta = byId.get(v.CashflowID);
    return results({
      ...v,                 
      Metric: meta.Metric,  
      Unit: meta.Unit, 
      Period: timelineMap.get(v?.FileID),
    });
  });
}