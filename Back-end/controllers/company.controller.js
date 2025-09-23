import { listCompaniesService } from "../services/company.service.js";

export const listCompaniesController = async (req,res) => {
  try {
    const data = await listCompaniesService();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**export async function listCompaniesController(req, res) {
  try {
    const data = await listCompaniesService();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}*/
