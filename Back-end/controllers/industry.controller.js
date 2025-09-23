import {
  listIndustriesService,
  getIndustryByIdService
} from "../services/industry.service.js";

export const listIndustriesController = async (req,res) => {
  try {
    const data = await listIndustriesService();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export const getIndustryByIdController = async(req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    const item = await getIndustryByIdService(idNum);
    if (!item) return res.status(404).json({ error: "Not found" });

    return res.json(item);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
