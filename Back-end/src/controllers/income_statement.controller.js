import { incomeService } from "../services/income_statement.service.js"

export const incomeController = async (req,res) => {
  
  try {
    const parameters = {}
    for (const key in req.query){
      parameters[key.toLowerCase()] = req.query[key]
    }

    const filters = {
      metric : parameters.metric,
      unit : parameters.unit,
      incomeid: parameters.incomeid,           
      applicationid: parameters.applicationid,      
      fileid: parameters.fileid
    }
  
    const incomes = await incomeService(filters)
    return res.json(incomes)  
  } 
  catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
