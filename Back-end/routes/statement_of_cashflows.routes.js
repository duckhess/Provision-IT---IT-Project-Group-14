import { Router } from "express"
import { socController } from "../controllers/statement_of_casflows.controller.js"

const router = Router()

router.get('/', socController)

export default router