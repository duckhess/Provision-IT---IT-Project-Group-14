import { best4MetricsService } from "../services/best_four_metrics.service.js";

export async function bestMetricsController(req, res) {
  try {
    const parameters = {};
    for (const key in req.query) {
      parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      companyid: parameters.companyid,
      applicationid: parameters.applicationid,
      metricid: parameters.metricid,
    };

    const datas = await best4MetricsService(filters);
    return res.json(datas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
