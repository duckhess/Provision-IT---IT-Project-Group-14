import express from 'express'
import financial_controller from '../controllers/financial_controller.js'

const router = express.Router()

router.get('/', financial_controller.fetch_statements)

export default router