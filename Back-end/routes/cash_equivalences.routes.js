import express from 'express'
import cash_controller from '../controllers/cash_controller.js'

const router = express.Router()

router.get('/', cash_controller.fetch_cash_equivalences)

export default router