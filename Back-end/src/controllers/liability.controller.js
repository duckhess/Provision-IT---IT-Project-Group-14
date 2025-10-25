import { liabilityService } from "../services/liability.service.js";

export const liabilityController = async (req, res) => {
  try {
    const parameters = {};
    for (const key in req.query) {
      parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      metric: parameters.metric,
      unit: parameters.unit,
      liabilityid: parameters.liabilityid,
      applicationid: parameters.applicationid,
      fileid: parameters.fileid,
    };

    const liabilities = await liabilityService(filters);
    return res.json(liabilities);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
