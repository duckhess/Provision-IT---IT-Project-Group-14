import { Router } from "express"
import { fetch_statements } from '../controllers/financial_controller.js'

const router = Router()

router.get('/', fetch_statements)

export default router