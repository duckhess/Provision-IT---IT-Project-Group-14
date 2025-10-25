import { company_data_service } from "../services/company_data.service.js";

export const data_controller = async (req, res) => {
  try {
    const parameters = {};
    for (const key in req.query) {
      parameters[key.toLowerCase()] = req.query[key];
    }

    const filters = {
      companyid: parameters.companyid,
      applicationid: parameters.applicationid,
    };

    const datas = await company_data_service(filters);
    return res.json(datas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
