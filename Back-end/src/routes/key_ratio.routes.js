import { Router } from "express"
import { keyRatioController } from "../controllers/key_ratio.controller.js"

const router = Router()

router.get('/', keyRatioController)

export default router