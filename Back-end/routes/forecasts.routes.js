import express from 'express'
import forecast_controller from '../controllers/forecast_controller.js'

const router = express.Router()

router.get('/', forecast_controller.fetch_forecasts)

export default router