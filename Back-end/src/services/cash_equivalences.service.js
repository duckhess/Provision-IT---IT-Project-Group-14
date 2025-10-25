import cash_schema from "../models/cash_equivalences.js";
import cash_values_schema from "../models/cash_values.js";
import { get_period } from "./timeline.service.js";

export async function filter_cash_equivalences(filters = {}) {
  const matching_params = {};

  if (filters.cashid) matching_params.CashID = Number(filters.cashid);
  if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.fileid) matching_params.FileID = Number(filters.fileid);

  const value_rows = await cash_values_schema.find(matching_params).lean();

  const doc_rows = await cash_schema.find().lean();
  const mapped_docs = new Map();
  doc_rows.forEach((c) => mapped_docs.set(c.CashID, c));

  const file_ids = [...new Set(value_rows.map((v) => v.FileID))];
  const timeline_map = await get_period(file_ids);

  return value_rows.map((v) => {
    const cash = mapped_docs.get(v.CashID);
    return {
      CashID: cash.CashID,
      MetricName: cash.Metric,
      Unit: cash.Unit,
      ApplicationID: v.ApplicationID,
      Timeline: timeline_map.get(v?.FileID),
      Value: typeof v.Value === "number" ? v.Value : parseFloat(v.Value),
    };
  });
}
