// services/best_four_metrics.service.js
import best4Model from "../models/best_four_metrics.model.js"
import { filter_statements } from "./financial_statements.service.js"

/**
 * Main service: fetch best-4 metrics and return financial statement data
 */
export async function best4MetricsService(filters = {}) {
  const q = {}
  if (filters.companyid != null) q.CompanyID = Number(filters.companyid)
  if (filters.applicationid != null) q.ApplicationID = Number(filters.applicationid)
  if (filters.metricid != null) q.MetricID = Number(filters.metricid)

  const defs = await best4Model.find(q).select("-__v").lean()
  if (!defs || defs.length === 0) return []

  const results = await Promise.all(
    defs.map(async (d) => {
      const rows = await filter_statements({
        financialid: d.MetricID,
        applicationid: filters.applicationid ?? d.ApplicationID,
      })

      if (!rows || rows.length === 0) {
        return {
          CompanyID: d.CompanyID,
          ApplicationID: d.ApplicationID,
          Table: "financial_statements",
          MetricID: d.MetricID,
          MetricName: d.Metric,
          Unit: null,
          Data: [],
        }
      }

      const { Metric, Unit } = rows[0]
      return {
        CompanyID: d.CompanyID,
        ApplicationID: d.ApplicationID,
        Table: "financial_statements",
        MetricID: d.MetricID,
        MetricName: d.Metric,
        Unit,
        Data: rows.map(r => ({
          Timeline: r.Period,
          Value: r.Value,
        })),
      }
    })
  )

  return results
}
