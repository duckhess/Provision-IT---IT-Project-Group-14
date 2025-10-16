import { companyDataService } from "../services/company_data.service.js";

export const dataController = async (req,res) => {
  
  try {
    const parameters = {}
    for (const key in req.query){
      parameters[key.toLowerCase()] = req.query[key]
    }

    const filters = {
      companyid : parameters.companyid,       
      applicationid: parameters.applicationid,      
    }
  
    const datas = await companyDataService(filters)
    return res.json(datas)  
  } 
  catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
