import { Router } from "express"
import { fetch_abs } from '../controllers/abs_controller.js'

const router = Router()

router.get('/', fetch_abs)

export default router