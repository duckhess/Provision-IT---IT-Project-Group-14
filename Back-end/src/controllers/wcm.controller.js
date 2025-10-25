import { filter_wcm } from "../services/wcm.service.js";

export const fetch_wcm = async (req, res) => {
  try {
    const filter_querries = {};
    for (const key in req.query) {
      filter_querries[key.toLowerCase()] = req.query[key];
    }
    const wcm_document = await filter_wcm(filter_querries);
    res.json(wcm_document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
