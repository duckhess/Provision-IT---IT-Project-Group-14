import { Router } from "express"
import { fetch_cash_equivalences } from '../controllers/cash_equivalences.controller.js'

const router = Router()

router.get('/', fetch_cash_equivalences)

export default router