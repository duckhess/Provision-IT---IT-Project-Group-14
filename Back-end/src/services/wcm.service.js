import wcm_schema from "../models/working_capital_movements.js";
import wcm_values_schema from "../models/wcm_values.js";
import wcm_forecasts_schema from "../models/wcm_forecasts.js";
import { get_period } from "./timeline.service.js";

export async function filter_wcm(filters = {}) {
  const matching_params = {};

  if (filters.capitalid) matching_params.CapitalID = Number(filters.capitalid);
  if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.fileid) matching_params.FileID = Number(filters.fileid);

  const document = await wcm_schema.find().lean();
  const mapped_document = new Map();
  document.forEach((w) => mapped_document.set(w.CapitalID, w));

  const forecast = await wcm_forecasts_schema.find(matching_params).lean();
  const forecast_filters = forecast.map((d) => ({
    CapitalID: d.CapitalID,
    ApplicationID: d.ApplicationID,
  }));

  const value = await wcm_values_schema.find({ $or: forecast_filters }).lean();
  const mapped_value = new Map();
  value.forEach((f) => {
    const key = `${f.CapitalID}`;
    mapped_value.set(key, f);
  });

  // ✅ snake_case locals to satisfy ESLint
  const file_ids = [...new Set(value.map((v) => v.FileID))];
  const timeline_map = await get_period(file_ids);

  return forecast.map((f) => {
    const movements = mapped_document.get(f.CapitalID);
    const key = `${f.CapitalID}`;
    const v = mapped_value.get(key);
    return {
      CapitalID: f.CapitalID,
      MetricName: movements.Metric,
      Unit: movements.Unit,
      ApplicationID: f.ApplicationID,
      Timeline: timeline_map.get(v?.FileID),
      Value: parseFloat(v?.Value),
      "Avg Historical Forecast": parseFloat(f?.["Avg Historical Forecast"].toString()),
      "User Forecast": parseFloat(f?.["User Forecast"].toString()),
    };
  });
}
