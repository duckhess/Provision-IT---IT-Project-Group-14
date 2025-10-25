import { asset_service } from "../services/asset.service.js";

export const asset_controller = async (req, res) => {
  try {
    const filter_parameters = {};
    for (const key in req.query) {
      filter_parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      assetsid: filter_parameters.assetsid,
      unit: filter_parameters.unit,
      applicationid: filter_parameters.applicationid,
      fileid: filter_parameters.fileid,
      accountdescription: filter_parameters.accountdescription,
    };

    const asset_data = await asset_service(filters);
    return res.json(asset_data);
  } catch (error) {
    console.error("asset_controller error:", error);
    return res.status(500).json({ error: error.message });
  }
};
