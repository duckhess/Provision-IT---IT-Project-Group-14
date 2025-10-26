import { equity_service } from "../services/equity.service.js";

export const equity_controller = async (req, res) => {
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

    const equities = await equity_service(filters);
    return res.json(equities);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
