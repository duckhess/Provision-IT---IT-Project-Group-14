import { Router } from "express"
import { assetController } from "../controllers/asset.controllers.js"

const router = Router()

router.get('/', assetController)

export default router