// services/best_four_metrics.service.js
import best4Model from "../models/best_four_metrics.model.js";
//import { workingCapitalService } from "./wcm_service.js"; 
import { ratioService } from "./key_ratio.service.js"; 

// timeline map
const FILE_TIMELINE = { 1: "2023", 2: "2024", 3: "2025" };
const toTimeline = id => FILE_TIMELINE[id] || `File ${id}`;

/**
 * TABLE HANDLERS
 * Each table name corresponds to a function that returns the joined data for one metric.
 * You can add new handlers easily without changing the main logic.
 */
const TABLE_HANDLERS = {
  async key_ratios({ metricId, applicationId }) {
    const rows = await ratioService({
      keyratioid: metricId,
      applicationid: applicationId,
    });
    if (!rows || rows.length === 0) return null;

    const { MetricName, Unit } = rows[0];
    return {
      Table: "key_ratios",
      MetricID: metricId,
      MetricName,
      Unit,
      Data: rows.map(r => ({
        FileID: r.FileID,
        Timeline: toTimeline(r.FileID),
        Value: r.Value,
      })),
    };
  },

  /**async working_capital_movements({ metricId, applicationId }) {

    const rows = await workingCapitalService({
      movementid: metricId,
      applicationid: applicationId,
    });
    if (!rows || rows.length === 0) return null;

    const { MetricName, Unit } = rows[0];
    return {
      Table: "working_capital_movements",
      MetricID: metricId,
      MetricName,
      Unit,
      Data: rows.map(r => ({
        FileID: r.FileID,
        Timeline: toTimeline(r.FileID),
        Value: r.Value,
      })),
    };
  },*/
};

/**
 * Main service: fetch best-4 metrics and dispatch by table
 */
export async function best4MetricsService(filters = {}) {
  const q = {};
  if (filters.companyid != null) q.CompanyID = Number(filters.companyid);
  if (filters.applicationid != null) q.ApplicationID = Number(filters.applicationid);
  if (filters.metricid != null) q.MetricID = Number(filters.metricid);

  const defs = await best4Model.find(q).select("-__v").lean();
  if (!defs || defs.length === 0) return [];

  const results = await Promise.all(
    defs.map(async (d) => {
      const handler = TABLE_HANDLERS[d.Table];
      if (!handler) {
        return {
          CompanyID: d.CompanyID,
          ApplicationID: d.ApplicationID,
          Table: d.Table,
          MetricID: d.MetricID,
          MetricName: d.Metric,
          Unit: null,
          Data: [],
          Warning: `Handler not implemented for '${d.Table}'`,
        };
      }

      const payload = await handler({
        metricId: d.MetricID,
        applicationId: filters.applicationid ?? d.ApplicationID,
      });

      if (!payload) {
        return {
          CompanyID: d.CompanyID,
          ApplicationID: d.ApplicationID,
          Table: d.Table,
          MetricID: d.MetricID,
          MetricName: d.Metric,
          Unit: null,
          Data: [],
        };
      }

      return {
        CompanyID: d.CompanyID,
        ApplicationID: d.ApplicationID,
        ...payload,
      };
    })
  );

  return results;
}
