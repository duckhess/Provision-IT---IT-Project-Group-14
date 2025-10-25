import { filter_covenants } from "../services/covenants.service.js";

export const fetch_covenants = async (req, res) => {
  try {
    const filter_queries = {};
    for (const key in req.query) {
      filter_queries[key.toLowerCase()] = req.query[key];
    }
    const covenants_document = await filter_covenants(filter_queries);
    res.json(covenants_document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
