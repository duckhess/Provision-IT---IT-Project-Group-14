import { liability_service } from "../services/liability.service.js";

export const liability_controller = async (req, res) => {
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

    const liabilities = await liability_service(filters);
    return res.json(liabilities);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
