import { soc_service } from "../services/statement_of_cashflows.service.js";

export const soc_controller = async (req, res) => {
  try {
    const parameters = {};
    for (const key in req.query) {
      parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      metric: parameters.metric,
      unit: parameters.unit,
      cashflowid: parameters.cashflowid,
      applicationid: parameters.applicationid,
      fileid: parameters.fileid,
    };

    const soc = await soc_service(filters);
    return res.json(soc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
