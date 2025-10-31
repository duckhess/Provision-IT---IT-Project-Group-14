import best4_model from "../models/best_four_metrics.model.js";
import { filter_statements } from "./financial_statements.service.js";

/**
 * Main service: fetch best-4 metrics and return financial statement data
 */
export async function best_four_metrics_service(filters = {}) {
  const query = {};
  if (filters.companyid != null) query.CompanyID = Number(filters.companyid);
  if (filters.applicationid != null) query.ApplicationID = Number(filters.applicationid);
  if (filters.metricid != null) query.MetricID = Number(filters.metricid);

  const defs = await best4_model.find(query).select("-__v").lean();
  if (!defs || defs.length === 0) return [];

  const results = await Promise.all(
    defs.map(async (def) => {
      const rows = await filter_statements({
        financialid: def.MetricID,
        applicationid: filters.applicationid ?? def.ApplicationID,
      });

      if (!rows || rows.length === 0) {
        return {
          CompanyID: def.CompanyID,
          ApplicationID: def.ApplicationID,
          Table: "financial_statements",
          MetricID: def.MetricID,
          MetricName: def.Metric,
          Unit: null,
          Data: [],
        };
      }

      const { Unit } = rows[0];
      return {
        CompanyID: def.CompanyID,
        ApplicationID: def.ApplicationID,
        Table: "financial_statements",
        MetricID: def.MetricID,
        MetricName: def.Metric,
        Unit,
        Data: rows.map((r) => ({
          Timeline: r.Timeline,
          Value: r.Value,
        })),
      };
    }),
  );

  return results;
}
