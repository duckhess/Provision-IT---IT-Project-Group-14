import { assetService } from "../services/asset.service.js";

export const assetController = async (req,res) => {
  
  try {
    const parameters = {}
    for (const key in req.query){
      parameters[key.toLowerCase()] = req.query[key]
    }

    const filters = {
      assetsid : parameters.assetsid,
      unit : parameters.unit,         
      applicationid: parameters.applicationid,      
      fileid: parameters.fileid,
      accountdescription : parameters.accountdescription
    }
  
    const assets= await assetService(filters)
    return res.json(assets)  
  } 
  catch (err) {
    return res.status(500).json({ error: e.message })
  }
}
