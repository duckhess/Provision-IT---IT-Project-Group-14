import { equityService } from "../services/equity.service.js";

export const equityController = async (req, res) => {
  try {
    const parameters = {};
    for (const key in req.query) {
      parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      metric: parameters.metric,
      unit: parameters.unit,
      equityid: parameters.equityid,
      applicationid: parameters.applicationid,
      fileid: parameters.fileid,
    };

    const equities = await equityService(filters);
    return res.json(equities);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
