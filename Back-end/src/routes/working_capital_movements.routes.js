import { Router } from "express"
import { fetch_wcm } from '../controllers/wcm.controller.js'

const router = Router()

router.get('/', fetch_wcm)

export default router