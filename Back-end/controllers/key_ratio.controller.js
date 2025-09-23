import { getRatioByMetricNameService } from "../services/key_ratio.service.js";

export const getRatiosByMetricNameController = async (req,res) => {
  try {
    const metric = req.query.metric ?? req.query.metricName;
    const applicationId = Number(req.query.applicationId);
    const fileId = req.query.fileId != null ? Number(req.query.fileId) : undefined;

    const result = await getRatioByMetricNameService({
      metricName,
      applicationId: Number(applicationId),
      fileId: fileId != null ? Number(fileId) : undefined,
    });

    return res.json(result);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Internal Server Error' });
  }
}
