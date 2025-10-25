import { ratio_service } from "../services/key_ratio.service.js";

export const key_ratio_controller = async (req, res) => {
  try {
    const parameters = {};
    for (const key in req.query) {
      parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      metric: parameters.metric,
      unit: parameters.unit,
      keyratioid: parameters.keyratioid,
      applicationid: parameters.applicationid,
      fileid: parameters.fileid,
    };

    const ratios = await ratio_service(filters);
    return res.json(ratios);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
