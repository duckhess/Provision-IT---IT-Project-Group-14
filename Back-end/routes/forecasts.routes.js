import { Router } from "express"
import { fetch_forecasts } from '../controllers/forecast_controller.js'

const router = Router()

router.get('/', fetch_forecasts)

export default router