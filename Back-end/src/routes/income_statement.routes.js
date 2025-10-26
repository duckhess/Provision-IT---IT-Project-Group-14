import { Router } from "express"
import { incomeController } from "../controllers/income_statement.controller.js"

const router = Router()

router.get('/', incomeController)

export default router