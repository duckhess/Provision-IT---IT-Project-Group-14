import { socService } from "../services/statement_of_cashflows.service.js"

export const socController = async (req,res) => {
  
  try {
    const parameters = {}
    for (const key in req.query){
      parameters[key.toLowerCase()] = req.query[key]
    }

    const filters = {
      metric : parameters.metric,
      unit : parameters.unit,
      cashflowid: parameters.cashflowid,           
      applicationid: parameters.applicationid,      
      fileid: parameters.fileid
    }
  
    const soc = await socService(filters)
    return res.json(soc)  
  } 
  catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
