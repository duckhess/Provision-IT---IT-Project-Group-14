import {
  list_industries_service,
  get_industry_by_id_service
} from '../services/industry.service.js'

export const list_industries_controller = async (req,res) => {
  try {
    const {IndustryID} = req.query
    
    if(IndustryID) {
      const industry_id = Number(IndustryID)
      if (Number.isNaN(industry_id)) {
      return res.status(400).json({ error: "Industry ID must be a number" })
    }
    const item = await get_industry_by_id_service(industry_id);
    if (!item) return res.status(404).json({ error: "Not found" });

    return res.json(item);

    }

    const industries = await list_industries_service()
    return res.json(industries)
  } catch (err) {
    return res.status(500).json({ error: e.message })
  }
}

