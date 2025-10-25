import { asset_service } from "../services/asset.service.js";

export const asset_controller = async (req, res) => {
  try {
    const filter_parameters = {};
    for (const key in req.query) {
      filter_parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      assets_id: filter_parameters.assets_id,
      unit: filter_parameters.unit,
      application_id: filter_parameters.application_id,
      file_id: filter_parameters.file_id,
      account_description: filter_parameters.account_description,
    };

    const asset_data = await asset_service(filters);
    return res.json(asset_data);
  } catch (error) {
    console.error("asset_controller error:", error);
    return res.status(500).json({ error: error.message });
  }
};
