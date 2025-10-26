import { Router } from "express"
import { fetch_covenants } from '../controllers/covenants.controller.js'

const router = Router()

router.get('/', fetch_covenants)

export default router